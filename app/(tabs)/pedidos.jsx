import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { EmptyState } from "../../components/EmptyState";
import { colors } from "../../constants/theme";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency, formatDateTime } from "../../utils/format";

export default function PedidosScreen() {
  const { orders } = useAppData();
  
  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [selectedOrderTotal, setSelectedOrderTotal] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState("");

  const handleOpenPix = (total) => {
    setSelectedOrderTotal(total);
    setPaymentMessage("");
    setPixModalVisible(true);
  };

  const handleConfirmarPagamento = () => {
    setPixModalVisible(false);
    setPaymentMessage("Pagamento Pix confirmado. Retire seu pedido no balcao.");
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>
          Historico persistido localmente com AsyncStorage.
        </Text>
        {paymentMessage ? (
          <View style={styles.paymentSuccess}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.paymentSuccessText}>{paymentMessage}</Text>
          </View>
        ) : null}
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
                    {formatDateTime(item.createdAt)}
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

              <TouchableOpacity 
                style={styles.pixButton} 
                onPress={() => handleOpenPix(item.total)}
              >
                <Ionicons name="qr-code-outline" size={18} color={colors.lightText} />
                <Text style={styles.pixButtonText}>Pagar com PIX</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Modal
        visible={pixModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPixModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pagamento PIX</Text>
            <Text style={styles.modalTotal}>Valor: {formatCurrency(selectedOrderTotal)}</Text>
            
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={150} color={colors.text} />
              <Text style={styles.copyPasteText}>00020126580014BR.GOV.BCB.PIX...</Text>
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarPagamento}>
              <Text style={styles.confirmButtonText}>Confirmar Pagamento</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPixModalVisible(false)}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  paymentSuccess: {
    alignItems: "center",
    backgroundColor: "#0E2017",
    borderColor: colors.success,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    padding: 12
  },
  paymentSuccessText: {
    color: colors.success,
    flex: 1,
    fontSize: 13,
    fontWeight: "800"
  },
  list: {
    gap: 12,
    paddingBottom: 28
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 0,
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
    backgroundColor: "#0E2017",
    borderColor: colors.success,
    borderRadius: 0,
    borderWidth: 1,
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
  },
  pixButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 8
  },
  pixButtonText: {
    color: colors.lightText,
    fontWeight: '900',
    fontSize: 14,
    textTransform: 'uppercase'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    gap: 16
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900'
  },
  modalTotal: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700'
  },
  qrPlaceholder: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    gap: 10
  },
  copyPasteText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center'
  },
  confirmButton: {
    backgroundColor: colors.success,
    width: '100%',
    padding: 16,
    alignItems: 'center'
  },
  confirmButtonText: {
    color: colors.surface,
    fontWeight: '900',
    fontSize: 16
  },
  cancelText: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 8
  }
});
