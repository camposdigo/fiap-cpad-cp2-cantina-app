import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../constants/theme";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Input({ label, error, icon, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, error ? styles.inputError : null]}>
        {icon ? <Ionicons name={icon} size={19} color={colors.muted} /> : null}
        <TextInput
          placeholderTextColor="#82756B"
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
    fontSize: 14,
    fontWeight: "800"
  },
  inputBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
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
