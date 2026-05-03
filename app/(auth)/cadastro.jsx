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

export default function CadastroScreen() {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const errors = useMemo(
    () => ({
      name: name.trim().length === 0 ? "O nome completo e obrigatorio" : "",
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
            : "",
      confirmPassword:
        confirmPassword.length === 0
          ? "Confirme sua senha"
          : confirmPassword !== password
            ? "As senhas precisam ser iguais"
            : ""
    }),
    [confirmPassword, email, name, password]
  );

  const hasErrors = Boolean(
    errors.name || errors.email || errors.password || errors.confirmPassword
  );

  async function handleRegister() {
    setFormError("");

    if (hasErrors) {
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Falha ao criar cadastro"
      );
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
          <Text style={styles.title}>Crie seu acesso academico</Text>
          <Text style={styles.subtitle}>
            O cadastro fica salvo localmente com AsyncStorage para validar o
            proximo login.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome completo"
            icon="person-outline"
            onChangeText={setName}
            placeholder="Seu nome"
            value={name}
            error={errors.name}
          />
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
          <Input
            label="Confirmacao de senha"
            icon="shield-checkmark-outline"
            onChangeText={setConfirmPassword}
            placeholder="Repita sua senha"
            secureTextEntry
            value={confirmPassword}
            error={errors.confirmPassword}
          />
          {formError ? <Text style={styles.formError}>{formError}</Text> : null}
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
          <Button
            disabled={loading || hasErrors}
            icon="person-add-outline"
            label="Cadastrar"
            onPress={handleRegister}
          />
        </View>

        <Text style={styles.footerText}>
          Ja tem cadastro?{" "}
          <Link href="/login" style={styles.link}>
            Entrar
          </Link>
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
    marginBottom: 28,
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
    marginBottom: 24,
    paddingBottom: 24
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
  }
});
