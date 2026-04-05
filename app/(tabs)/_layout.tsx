import { Tabs } from 'expo-router';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../../components/ui/theme';
import { useAuth } from '../../context/AuthContext';

function HeaderTitle() {
  return (
    <View style={headerStyles.container}>
      <Image source={require('../../assets/logo.png')} style={headerStyles.logo} resizeMode="contain" />
      <Text style={headerStyles.title}>TH Hub</Text>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 30, height: 30 },
  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
});

function TabIcon({ name, color, focused }: { name: any; color: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', height: 32, justifyContent: 'flex-start' }}>
      <Ionicons name={name} size={22} color={color} />
      {focused && (
        <View style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: colors.primary,
          marginTop: 3,
        }} />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { isOwner } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: colors.text,
        headerTitle: () => <HeaderTitle />,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="myplan"
        options={{
          title: 'My Plan',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="clipboard" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="nutrition" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="chatbubbles" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
          ),
        }}
      />
      {/* Hide payments from tab bar - accessible from profile */}
      <Tabs.Screen
        name="payments"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
