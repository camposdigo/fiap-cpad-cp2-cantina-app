import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 0.8,
          textTransform: "uppercase"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cardapio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          )
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          )
        }}
      />
    </Tabs>
  );
}
