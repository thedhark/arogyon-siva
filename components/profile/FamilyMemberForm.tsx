import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';
import Animated, { FadeIn, SlideInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { User, Users, Baby, HandHeart } from 'lucide-react-native';

interface FamilyMemberFormProps {
  onSuccess: () => void;
}

const RELATIONS = [
  { id: 'father', label: 'Father', icon: Users },
  { id: 'mother', label: 'Mother', icon: HandHeart },
  { id: 'spouse', label: 'Spouse', icon: User },
  { id: 'child', label: 'Child', icon: Baby },
  { id: 'other', label: 'Other', icon: Users },
];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 60; // For age ruler

export default function FamilyMemberForm({ onSuccess }: FamilyMemberFormProps) {
  const { colors, isDark } = useTheme();
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('father');
  const [age, setAge] = useState(30);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initial scroll to default age
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: (30 - 1) * ITEM_WIDTH, animated: true });
    }, 500);
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const centerIndex = Math.round(offsetX / ITEM_WIDTH) + 1;
    if (centerIndex >= 1 && centerIndex <= 100) {
      setAge(centerIndex);
    }
  };

  const handleSubmit = () => {
    if (!name) return;
    
    addFamilyMember({
      name,
      relation: RELATIONS.find(r => r.id === relation)?.label || 'Other',
      dob: `${new Date().getFullYear() - age}-01-01`,
      gender: ['father', 'son'].includes(relation) ? 'Male' : 'Female',
    });
    
    Keyboard.dismiss();
    onSuccess();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add Family Member</Text>
      
      {/* Visual Relation Picker */}
      <View style={styles.relationContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relationScroll}>
          {RELATIONS.map((rel) => {
            const isSelected = relation === rel.id;
            const Icon = rel.icon;
            return (
              <TouchableOpacity
                key={rel.id}
                style={[
                  styles.relationBadge,
                  { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                  isSelected && { backgroundColor: colors.accent }
                ]}
                onPress={() => setRelation(rel.id)}
              >
                <Icon size={20} color={isSelected ? '#FFF' : colors.textMuted} />
                <Text style={[styles.relationText, { color: isSelected ? '#FFF' : colors.text }]}>
                  {rel.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.nameInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
          placeholder="Full Name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>

      {/* Unconventional Age Dial */}
      <View style={styles.ageContainer}>
        <Text style={[styles.ageLabel, { color: colors.textSecondary }]}>Select Age</Text>
        <Text style={[styles.ageDisplay, { color: colors.accent }]}>{age} <Text style={styles.ageSuffix}>years old</Text></Text>
        <Text style={[styles.dobHint, { color: colors.textMuted }]}>Born in {new Date().getFullYear() - age}</Text>
        
        <View style={[styles.rulerWrapper, { borderColor: isDark ? '#333' : '#E5E5E5' }]}>
          <View style={[styles.rulerIndicator, { backgroundColor: colors.accent }]} />
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: (width - 48 - ITEM_WIDTH) / 2 }}
          >
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <View key={num} style={[styles.rulerTickContainer, { width: ITEM_WIDTH }]}>
                <View style={[styles.rulerTick, { height: num % 5 === 0 ? 24 : 12, backgroundColor: isDark ? '#555' : '#CCC' }]} />
                {num % 5 === 0 && <Text style={[styles.rulerText, { color: colors.textMuted }]}>{num}</Text>}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: name ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!name}
      >
        <Text style={styles.submitText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: -0.5 },
  relationContainer: { marginBottom: 24, marginHorizontal: -24 },
  relationScroll: { paddingHorizontal: 24, gap: 12 },
  relationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
  },
  relationText: { fontSize: 16, fontWeight: '600' },
  inputWrapper: { marginBottom: 32 },
  nameInput: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  ageContainer: { marginBottom: 32, alignItems: 'center' },
  ageLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  ageDisplay: { fontSize: 36, fontWeight: '800', marginBottom: 2 },
  ageSuffix: { fontSize: 16, fontWeight: '600', color: '#9CA3AF' },
  dobHint: { fontSize: 13, fontWeight: '500', marginBottom: 20 },
  rulerWrapper: {
    height: 80,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  rulerIndicator: {
    position: 'absolute',
    width: 4,
    height: 40,
    borderRadius: 2,
    left: '50%',
    marginLeft: -2,
    top: 20,
    zIndex: 10,
  },
  rulerTickContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
  },
  rulerTick: { width: 2, borderRadius: 1, marginBottom: 4 },
  rulerText: { fontSize: 12, fontWeight: '600' },
  submitButton: { 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  submitText: { color: '#FFF', fontSize: 18, fontWeight: '700' }
});
