import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { isValidEmail } from "../../utils/format";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const errors = useMemo(
    () => ({
      email:
        email.trim().length === 0
          ? "O e-mail e obrigatorio"
          : !isValidEmail(email)
            ? "Informe um e-mail valido"
            : "",
      password:
        password.length === 0
          ? "A senha e obrigatoria"
          : password.length < 6
            ? "A senha deve ter pelo menos 6 caracteres"
            : ""
    }),
    [email, password]
  );

  const hasErrors = Boolean(errors.email || errors.password);

  async function handleLogin() {
    setFormError("");

    if (hasErrors) {
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao entrar");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.decorTop}>
          <View style={styles.dot} />
          <View style={styles.tinyDot} />
          <View style={styles.dot} />
        </View>
        <View style={styles.header}>
          <Text style={styles.logoText}>FIAP</Text>
          <Text style={styles.brand}>Cantina FIAP</Text>
          <Text style={styles.title}>
            Conecte-se com sua jornada academica
          </Text>
          <Text style={styles.subtitle}>
            Use seu cadastro para acessar o cardapio e seus pedidos salvos.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            label="E-mail"
            icon="mail-outline"
            onChangeText={setEmail}
            placeholder="usuario@dominio.com"
            value={email}
            error={errors.email}
          />
          <Input
            label="Senha"
            icon="lock-closed-outline"
            onChangeText={setPassword}
            placeholder="Minimo 6 caracteres"
            secureTextEntry
            value={password}
            error={errors.password}
          />
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
          <Button
            disabled={loading || hasErrors}
            icon="log-in-outline"
            label="Entrar"
            onPress={handleLogin}
          />
        </View>

        <Text style={styles.footerText}>
          Ainda nao tem conta?{" "}
          <Link href="/cadastro" style={styles.link}>
            Cadastre-se
          </Link>
        </Text>
        <Text style={styles.supportText}>
          Em caso de duvidas, procure o suporte academico.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },
  decorTop: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
    opacity: 0.7
  },
  dot: {
    backgroundColor: colors.text,
    borderRadius: 3,
    height: 5,
    width: 5
  },
  tinyDot: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    height: 3,
    marginTop: 1,
    width: 3
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 12,
    marginBottom: 28,
    paddingBottom: 26
  },
  logoText: {
    color: colors.primary,
    fontSize: 46,
    fontWeight: "300",
    letterSpacing: 3
  },
  brand: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 3,
    textTransform: "uppercase"
  },
  title: {
    color: colors.primary,
    fontSize: 27,
    fontWeight: "300",
    letterSpacing: 3,
    lineHeight: 36,
    textTransform: "uppercase"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  },
  form: {
    gap: 14
  },
  formError: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800"
  },
  footerText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 24,
    textAlign: "center"
  },
  link: {
    color: colors.primary,
    fontWeight: "900"
  },
  supportText: {
    color: "#5F6B70",
    fontSize: 12,
    marginTop: 32,
    textAlign: "center"
  }
});
