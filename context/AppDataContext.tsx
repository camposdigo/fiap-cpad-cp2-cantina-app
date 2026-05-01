import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { products } from "../data/products";
import { Cart, Order } from "../types/app";

const CART_KEY = "@cantina_fiap:cart";
const ORDERS_KEY = "@cantina_fiap:orders";

type AppDataContextValue = {
  cart: Cart;
  orders: Order[];
  loading: boolean;
  successMessage: string;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => Promise<void>;
  confirmOrder: () => Promise<void>;
  clearSuccess: () => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [storedCart, storedOrders] = await Promise.all([
          AsyncStorage.getItem(CART_KEY),
          AsyncStorage.getItem(ORDERS_KEY)
        ]);

        if (storedCart) {
          setCart(JSON.parse(storedCart) as Cart);
        }

        if (storedOrders) {
          setOrders(JSON.parse(storedOrders) as Order[]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, loading]);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }, [loading, orders]);

  function addToCart(productId: string) {
    setCart((currentCart) => ({
      ...currentCart,
      [productId]: (currentCart[productId] ?? 0) + 1
    }));
  }

  function removeFromCart(productId: string) {
    setCart((currentCart) => {
      const quantity = currentCart[productId] ?? 0;
      if (quantity <= 1) {
        const nextCart = { ...currentCart };
        delete nextCart[productId];
        return nextCart;
      }

      return {
        ...currentCart,
        [productId]: quantity - 1
      };
    });
  }

  async function clearCart() {
    setCart({});
    await AsyncStorage.removeItem(CART_KEY);
  }

  async function confirmOrder() {
    const items = products
      .map((product) => ({
        ...product,
        quantity: cart[product.id] ?? 0
      }))
      .filter((product) => product.quantity > 0);

    if (items.length === 0) {
      return;
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: Order = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      items,
      total
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCart({});
    setSuccessMessage("Pedido confirmado para retirada");
    await AsyncStorage.setItem(CART_KEY, JSON.stringify({}));
  }

  const value = useMemo(
    () => ({
      cart,
      orders,
      loading,
      successMessage,
      addToCart,
      removeFromCart,
      clearCart,
      confirmOrder,
      clearSuccess: () => setSuccessMessage("")
    }),
    [cart, loading, orders, successMessage]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  }

  return context;
}
