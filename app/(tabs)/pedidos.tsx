import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "../../components/EmptyState";
import { colors } from "../../constants/theme";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../utils/format";

export default function PedidosScreen() {
  const { orders } = useAppData();

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>
          Historico persistido localmente com AsyncStorage.
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="Nenhum pedido ainda"
          message="Quando voce confirmar uma retirada, o pedido aparecera aqui mesmo depois de reabrir o app."
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderTitle}>Pedido #{item.id.slice(-4)}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </Text>
                </View>
                <View style={styles.status}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.statusText}>Confirmado</Text>
                </View>
              </View>

              {item.items.map((product) => (
                <View key={product.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {product.quantity}x {product.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(product.price * product.quantity)}
                  </Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.total}>{formatCurrency(item.total)}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 18,
    paddingTop: 54
  },
  header: {
    gap: 6,
    marginBottom: 18
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  },
  list: {
    gap: 12,
    paddingBottom: 28
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  orderHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  orderTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  orderDate: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2
  },
  status: {
    alignItems: "center",
    backgroundColor: "#E8F5ED",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  statusText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  itemName: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    paddingRight: 8
  },
  itemPrice: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  totalRow: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  total: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900"
  }
});
