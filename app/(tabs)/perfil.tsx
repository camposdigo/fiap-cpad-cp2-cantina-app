import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../../components/Button";
import { colors } from "../../constants/theme";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/format";

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const { orders, cart, clearCart } = useAppData();

  const cartQuantity = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={34} color={colors.lightText} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{user?.name}</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{orders.length}</Text>
          <Text style={styles.metricLabel}>pedidos</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{cartQuantity}</Text>
          <Text style={styles.metricLabel}>no carrinho</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Resumo</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total ja pedido</Text>
          <Text style={styles.rowValue}>{formatCurrency(totalSpent)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Sessao</Text>
          <Text style={styles.rowValue}>Persistida</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Diferencial</Text>
          <Text style={styles.rowValue}>Busca em tempo real</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          disabled={cartQuantity === 0}
          icon="trash-outline"
          label="Limpar carrinho"
          onPress={clearCart}
          variant="secondary"
        />
        <Button icon="log-out-outline" label="Sair" onPress={logout} variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flex: 1,
    gap: 18,
    padding: 18,
    paddingTop: 54
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 0,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    padding: 16
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderRadius: 0,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58
  },
  headerText: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 3
  },
  metrics: {
    flexDirection: "row",
    gap: 12
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 0,
    borderWidth: 1,
    flex: 1,
    padding: 16
  },
  metricValue: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 2
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 0,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  panelTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  row: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12
  },
  rowLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700"
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  actions: {
    gap: 12,
    marginTop: "auto"
  }
});
