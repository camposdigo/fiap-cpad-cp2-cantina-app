import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { EmptyState } from "../../components/EmptyState";
import { categories, Category, products } from "../../data/products";
import { colors } from "../../constants/theme";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/format";

export default function MenuScreen() {
  const { user, successMessage: authSuccess, clearSuccess: clearAuthSuccess } =
    useAuth();
  const {
    cart,
    loading,
    successMessage,
    addToCart,
    removeFromCart,
    confirmOrder,
    clearSuccess
  } = useAppData();
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");

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

  return (
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
              <Text style={styles.subtitle}>Ola, {user?.name.split(" ")[0]}</Text>
            </View>
            <View style={styles.cartBadge}>
              <Ionicons name="bag-outline" size={22} color={colors.text} />
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Monte seu pedido antes da fila.</Text>
        </View>
      </ImageBackground>

      {authSuccess ? (
        <Pressable onPress={clearAuthSuccess} style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.successText}>{authSuccess}</Text>
        </Pressable>
      ) : null}

      {successMessage ? (
        <Pressable onPress={clearSuccess} style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </Pressable>
      ) : null}

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={colors.muted} />
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

      {filteredProducts.length === 0 ? (
        <View style={styles.listPadding}>
          <EmptyState
            icon="search-outline"
            title="Nada encontrado"
            message="Tente outro termo ou escolha uma categoria diferente."
          />
        </View>
      ) : (
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
                  <Ionicons name="time-outline" size={16} color={colors.muted} />
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
                  <Ionicons name="add" size={22} color={colors.lightText} />
                </Pressable>
              </View>
            </View>
          )}
          scrollEnabled={false}
        />
      )}

      <View style={styles.checkoutPanel}>
        <View>
          <Text style={styles.checkoutTitle}>Pedido atual</Text>
          <Text style={styles.checkoutSubtitle}>
            {cartItems.length === 0
              ? "Nenhum item selecionado"
              : `${cartItems.length} item(ns) no carrinho`}
          </Text>
        </View>

        {loading ? <ActivityIndicator color={colors.warning} /> : null}

        {cartItems.length === 0 ? (
          <Text style={styles.emptyCart}>Adicione itens para liberar a retirada.</Text>
        ) : null}

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
                <Ionicons name="remove" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => addToCart(item.id)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={18} color={colors.text} />
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
          onPress={confirmOrder}
          style={[
            styles.checkoutButton,
            cartItems.length === 0 && styles.checkoutDisabled
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.lightText} />
          <Text style={styles.checkoutButtonText}>Confirmar retirada</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
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
    backgroundColor: "rgba(247, 243, 234, 0.44)",
    flex: 1,
    justifyContent: "space-between",
    padding: 22
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  brand: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  subtitle: {
    color: "#3E342C",
    fontSize: 14,
    marginTop: 2
  },
  cartBadge: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
    elevation: 2,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  cartBadgeText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38,
    maxWidth: 310
  },
  successBox: {
    alignItems: "center",
    backgroundColor: "#E8F5ED",
    borderColor: "#B8E0C9",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    marginHorizontal: 18,
    padding: 12
  },
  successText: {
    color: colors.success,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 18,
    paddingHorizontal: 14
  },
  searchInput: {
    color: colors.text,
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  categoryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  categoryTextActive: {
    color: colors.lightText
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  listPadding: {
    padding: 18
  },
  productList: {
    gap: 12,
    padding: 18
  },
  productCard: {
    backgroundColor: colors.surface,
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
    color: colors.text,
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
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  tag: {
    backgroundColor: colors.warning,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  tagText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900"
  },
  productActions: {
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  price: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  addButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  checkoutPanel: {
    backgroundColor: colors.dark,
    gap: 14,
    marginHorizontal: 18,
    marginTop: 4,
    padding: 18
  },
  checkoutTitle: {
    color: colors.lightText,
    fontSize: 20,
    fontWeight: "900"
  },
  checkoutSubtitle: {
    color: "#D9CBBE",
    fontSize: 14,
    marginTop: 3
  },
  emptyCart: {
    color: "#D9CBBE",
    fontSize: 14
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
    color: colors.lightText,
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
    backgroundColor: colors.background,
    borderRadius: 8,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  quantityText: {
    color: colors.lightText,
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
    color: colors.lightText,
    fontSize: 22,
    fontWeight: "900"
  },
  checkoutButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
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
    color: colors.lightText,
    fontSize: 15,
    fontWeight: "900"
  }
});
