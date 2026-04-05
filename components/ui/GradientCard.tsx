import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from './theme';

interface GradientCardProps {
  children: React.ReactNode;
  gradientColors?: [string, string, ...string[]];
  style?: ViewStyle;
  borderOnly?: boolean;
  glowColor?: string;
}

export function GradientCard({
  children,
  gradientColors = [colors.primary + '60', colors.accent + '40'] as [string, string],
  style,
  borderOnly = true,
  glowColor,
}: GradientCardProps) {
  if (borderOnly) {
    return (
      <View style={[styles.outerWrapper, glowColor && shadows.glow(glowColor), style]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.innerContent}>
            {children}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.solidCard, glowColor && shadows.glow(glowColor), style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradientBorder: {
    padding: 1.5,
    borderRadius: borderRadius.lg,
  },
  innerContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg - 1,
    padding: 16,
  },
  solidCard: {
    borderRadius: borderRadius.lg,
    padding: 16,
  },
});
