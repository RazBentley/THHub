import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserProfile, NutritionTargets } from '../../types';
import { Button } from '../../components/ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../components/ui/theme';

interface ClientWithTargets extends UserProfile {
  targets?: NutritionTargets;
}

export default function OverridesScreen() {
  const [clients, setClients] = useState<ClientWithTargets[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const snap = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'client'))
      );
      const list: ClientWithTargets[] = [];
      for (const userDoc of snap.docs) {
        const profile = userDoc.data() as UserProfile;
        const targetsDoc = await getDoc(doc(db, 'users', profile.uid, 'settings', 'nutritionTargets'));
        list.push({
          ...profile,
          targets: targetsDoc.exists() ? targetsDoc.data() as NutritionTargets : undefined,
        });
      }
      list.sort((a, b) => a.name.localeCompare(b.name));
      setClients(list);
    } catch (err) {
      Alert.alert('Error', 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  const updateTargets = async (uid: string, targets: NutritionTargets) => {
    try {
      await setDoc(doc(db, 'users', uid, 'settings', 'nutritionTargets'), targets);
      setClients((prev) =>
        prev.map((c) => (c.uid === uid ? { ...c, targets } : c))
      );
      Alert.alert('Success', 'Nutrition targets updated');
    } catch (err) {
      Alert.alert('Error', 'Failed to update targets');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Nutrition Overrides' }} />
      <FlatList
        style={styles.container}
        data={clients}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ClientTargetCard client={item} onSave={(targets) => updateTargets(item.uid, targets)} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{loading ? 'Loading...' : 'No clients found'}</Text>
          </View>
        }
      />
    </>
  );
}

function ClientTargetCard({ client, onSave }: { client: ClientWithTargets; onSave: (t: NutritionTargets) => void }) {
  const [calories, setCalories] = useState(String(client.targets?.calories || '2000'));
  const [protein, setProtein] = useState(String(client.targets?.protein || '150'));
  const [carbs, setCarbs] = useState(String(client.targets?.carbs || '250'));
  const [fat, setFat] = useState(String(client.targets?.fat || '70'));

  return (
    <View style={styles.card}>
      <Text style={styles.clientName}>{client.name}</Text>
      <Text style={styles.clientEmail}>{client.email}</Text>

      <View style={styles.targetGrid}>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Calories</Text>
          <TextInput
            style={styles.targetInput}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Protein (g)</Text>
          <TextInput
            style={styles.targetInput}
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Carbs (g)</Text>
          <TextInput
            style={styles.targetInput}
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Fat (g)</Text>
          <TextInput
            style={styles.targetInput}
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Button
        title="Save Targets"
        variant="secondary"
        onPress={() => onSave({
          calories: parseInt(calories) || 2000,
          protein: parseInt(protein) || 150,
          carbs: parseInt(carbs) || 250,
          fat: parseInt(fat) || 70,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  clientName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  clientEmail: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginBottom: spacing.md,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  targetItem: {
    width: '47%',
  },
  targetLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  targetInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
  },
});
