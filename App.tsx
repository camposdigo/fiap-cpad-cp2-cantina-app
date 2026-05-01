import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type Category = "Todos" | "Lanches" | "Bebidas" | "Saudaveis";

type Product = {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "Todos">;
  price: number;
  prepTime: string;
  highlight?: boolean;
};

const categories: Category[] = ["Todos", "Lanches", "Bebidas", "Saudaveis"];

const products: Product[] = [
  {
    id: "1",
    name: "Wrap Frango Tech",
    description: "Frango grelhado, queijo branco, alface e molho da casa.",
    category: "Lanches",
    price: 18.9,
    prepTime: "8 min",
    highlight: true
  },
  {
    id: "2",
    name: "Bowl Sprint",
    description: "Arroz integral, grao-de-bico, legumes e proteina do dia.",
    category: "Saudaveis",
    price: 24.5,
    prepTime: "10 min"
  },
  {
    id: "3",
    name: "Suco Deploy",
    description: "Laranja, cenoura e gengibre batidos na hora.",
    category: "Bebidas",
    price: 9.9,
    prepTime: "4 min"
  },
  {
    id: "4",
    name: "Pao de Queijo Stack",
    description: "Porcao com seis unidades assadas no periodo.",
    category: "Lanches",
    price: 12.0,
    prepTime: "5 min"
  },
  {
    id: "5",
    name: "Salada Cloud",
    description: "Mix de folhas, tomate cereja, croutons e molho leve.",
    category: "Saudaveis",
    price: 19.9,
    prepTime: "7 min"
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const cartItems = products
    .map((product) => ({
      ...product,
      quantity: cart[product.id] ?? 0
    }))
    .filter((product) => product.quantity > 0);

  const cartTotal = cartItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.page}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80"
          }}
          imageStyle={styles.heroImage}
          style={styles.hero}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.header}>
              <View>
                <Text style={styles.brand}>Cantina FIAP</Text>
                <Text style={styles.subtitle}>Pedido rapido para o intervalo</Text>
              </View>
              <View style={styles.cartBadge}>
                <Ionicons name="bag-outline" size={22} color="#241A12" />
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Monte seu pedido antes da fila.</Text>
          </View>
        </ImageBackground>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6E625A" />
          <TextInput
            accessibilityLabel="Buscar produto"
            onChangeText={setQuery}
            placeholder="Buscar por lanche, bebida ou salada"
            placeholderTextColor="#82756B"
            style={styles.searchInput}
            value={query}
          />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.categoryList}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <Pressable
                accessibilityRole="button"
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[styles.categoryButton, isSelected && styles.categoryActive]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cardapio</Text>
          <Text style={styles.sectionMeta}>{filteredProducts.length} itens</Text>
        </View>

        <FlatList
          contentContainerStyle={styles.productList}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productInfo}>
                <View style={styles.productTitleRow}>
                  <Text style={styles.productName}>{item.name}</Text>
                  {item.highlight ? (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Popular</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.productDescription}>{item.description}</Text>
                <View style={styles.productMeta}>
                  <Ionicons name="time-outline" size={16} color="#76685E" />
                  <Text style={styles.metaText}>{item.prepTime}</Text>
                </View>
              </View>
              <View style={styles.productActions}>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addToCart(item.id)}
                  style={styles.addButton}
                >
                  <Ionicons name="add" size={22} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />

        <View style={styles.checkoutPanel}>
          <View>
            <Text style={styles.checkoutTitle}>Pedido</Text>
            <Text style={styles.checkoutSubtitle}>
              {cartItems.length === 0
                ? "Nenhum item selecionado"
                : `${cartItems.length} item(ns) no carrinho`}
            </Text>
          </View>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </View>
              <View style={styles.quantityControl}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => removeFromCart(item.id)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="remove" size={18} color="#241A12" />
                </Pressable>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => addToCart(item.id)}
                  style={styles.quantityButton}
                >
                  <Ionicons name="add" size={18} color="#241A12" />
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(cartTotal)}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={cartItems.length === 0}
            style={[
              styles.checkoutButton,
              cartItems.length === 0 && styles.checkoutDisabled
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text style={styles.checkoutButtonText}>Confirmar retirada</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F3EA"
  },
  page: {
    paddingBottom: 28
  },
  hero: {
    minHeight: 240,
    justifyContent: "flex-end",
    marginBottom: 18
  },
  heroImage: {
    opacity: 0.88
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 22,
    backgroundColor: "rgba(247, 243, 234, 0.44)"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  brand: {
    color: "#241A12",
    fontSize: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: "#3E342C",
    fontSize: 14,
    marginTop: 2
  },
  cartBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 2,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: "#241A12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10
  },
  cartBadgeText: {
    color: "#241A12",
    fontSize: 15,
    fontWeight: "800"
  },
  heroTitle: {
    color: "#241A12",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    maxWidth: 310
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4D9CC",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 18,
    paddingHorizontal: 14
  },
  searchInput: {
    color: "#241A12",
    flex: 1,
    fontSize: 15,
    minHeight: 48
  },
  categoryList: {
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4D9CC",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  categoryActive: {
    backgroundColor: "#C4472D",
    borderColor: "#C4472D"
  },
  categoryText: {
    color: "#5C514A",
    fontSize: 14,
    fontWeight: "700"
  },
  categoryTextActive: {
    color: "#FFFFFF"
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },
  sectionTitle: {
    color: "#241A12",
    fontSize: 22,
    fontWeight: "900"
  },
  sectionMeta: {
    color: "#76685E",
    fontSize: 14,
    fontWeight: "700"
  },
  productList: {
    gap: 12,
    padding: 18
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7DCD0",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 14
  },
  productInfo: {
    flex: 1,
    gap: 8
  },
  productTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  productName: {
    color: "#241A12",
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "900"
  },
  productDescription: {
    color: "#5C514A",
    fontSize: 14,
    lineHeight: 20
  },
  productMeta: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  metaText: {
    color: "#76685E",
    fontSize: 13,
    fontWeight: "700"
  },
  tag: {
    backgroundColor: "#F2B84B",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tagText: {
    color: "#241A12",
    fontSize: 11,
    fontWeight: "900"
  },
  productActions: {
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  price: {
    color: "#241A12",
    fontSize: 16,
    fontWeight: "900"
  },
  addButton: {
    alignItems: "center",
    backgroundColor: "#1F6F5B",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  checkoutPanel: {
    backgroundColor: "#241A12",
    gap: 14,
    marginHorizontal: 18,
    marginTop: 4,
    padding: 18
  },
  checkoutTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900"
  },
  checkoutSubtitle: {
    color: "#D9CBBE",
    fontSize: 14,
    marginTop: 3
  },
  cartItem: {
    alignItems: "center",
    borderTopColor: "rgba(255, 255, 255, 0.16)",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12
  },
  cartItemInfo: {
    flex: 1,
    paddingRight: 12
  },
  cartItemName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800"
  },
  cartItemPrice: {
    color: "#D9CBBE",
    fontSize: 13,
    marginTop: 2
  },
  quantityControl: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  quantityButton: {
    alignItems: "center",
    backgroundColor: "#F7F3EA",
    borderRadius: 8,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  quantityText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    minWidth: 18,
    textAlign: "center"
  },
  totalRow: {
    alignItems: "center",
    borderTopColor: "rgba(255, 255, 255, 0.16)",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14
  },
  totalLabel: {
    color: "#D9CBBE",
    fontSize: 14,
    fontWeight: "800"
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900"
  },
  checkoutButton: {
    alignItems: "center",
    backgroundColor: "#C4472D",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48
  },
  checkoutDisabled: {
    opacity: 0.45
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  }
});
