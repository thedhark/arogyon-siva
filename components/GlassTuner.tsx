import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useGlass } from '@/contexts/GlassContext';
import { Settings2, X, Plus, Minus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Stepper({ label, value, step, min, max, onChange }: any) {
  return (
    <View style={styles.stepperContainer}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Minus size={16} color="#000" />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}</Text>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Plus size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function GlassTuner() {
  const { settings, updateSetting } = useGlass();
  const [isOpen, setIsOpen] = useState(false);
  const insets = useSafeAreaInsets();

  if (!isOpen) {
    return (
      <TouchableOpacity 
        style={[styles.floatingBtn, { top: insets.top + 80 }]} 
        onPress={() => setIsOpen(true)}
      >
        <Settings2 size={24} color="#FFF" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.panel, { top: insets.top + 80 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Glass Tuner</Text>
        <TouchableOpacity onPress={() => setIsOpen(false)}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Stepper 
          label="Blur Intensity" 
          value={settings.intensity} 
          step={10} min={0} max={100} 
          onChange={(v: number) => updateSetting('intensity', v)} 
        />
        <Stepper 
          label="Background Opacity" 
          value={settings.bgOpacity} 
          step={0.05} min={0} max={1} 
          onChange={(v: number) => updateSetting('bgOpacity', v)} 
        />
        <Stepper 
          label="Outer Edge Highlight" 
          value={settings.borderOpacity} 
          step={0.05} min={0} max={1} 
          onChange={(v: number) => updateSetting('borderOpacity', v)} 
        />
        <Stepper 
          label="Inner 3D Thickness" 
          value={settings.highlightOpacity} 
          step={0.05} min={0} max={1} 
          onChange={(v: number) => updateSetting('highlightOpacity', v)} 
        />
        <Stepper 
          label="Glass Layers" 
          value={settings.layers} 
          step={1} min={1} max={3} 
          onChange={(v: number) => updateSetting('layers', v)} 
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBtn: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  panel: {
    position: 'absolute',
    right: 16,
    width: 280,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepperContainer: {
    marginBottom: 16,
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  btn: {
    width: 36,
    height: 36,
    backgroundColor: '#FFF',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  }
});
