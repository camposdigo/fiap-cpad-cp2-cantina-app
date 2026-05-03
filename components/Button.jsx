import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/theme";

export function Button({
  label,
  icon,
  onPress,
  disabled = false,
  variant = "primary"
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
        variant === "danger" && styles.danger,
        disabled && styles.disabled
      ]}
    >
      {icon ? <Ionicons name={icon} size={20} color={colors.lightText} /> : null}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderRadius: 0,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16
  },
  secondary: {
    borderColor: colors.accent
  },
  danger: {
    borderColor: colors.danger
  },
  disabled: {
    opacity: 0.45
  },
  label: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase"
  }
});
