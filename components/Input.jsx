import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/theme";

export function Input({ label, error, icon, style, ...props }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, error ? styles.inputError : null]}>
        {icon ? <Ionicons name={icon} size={19} color={colors.primary} /> : null}
        <TextInput
          placeholderTextColor="#657277"
          style={[styles.input, style]}
          {...props}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: 0,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14
  },
  inputError: {
    borderColor: colors.danger
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: 15
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700"
  }
});
