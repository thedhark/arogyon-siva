import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Keyboard } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useProfileStore } from '@/hooks/useProfileStore';
import { User, Users, Baby, HandHeart, Plus, Minus, Heart } from 'lucide-react-native';

interface FamilyMemberFormProps {
  onSuccess: () => void;
}

const RELATIONS = [
  { id: 'father', label: 'Father', icon: Users },
  { id: 'mother', label: 'Mother', icon: HandHeart },
  { id: 'spouse', label: 'Spouse', icon: User },
  { id: 'child', label: 'Child', icon: Baby },
  { id: 'sibling', label: 'Sibling', icon: Users },
  { id: 'grandparent', label: 'Grandparent', icon: Users },
  { id: 'other', label: 'Other', icon: Users },
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 60; // For age ruler

export default function FamilyMemberForm({ onSuccess }: FamilyMemberFormProps) {
  const { colors, isDark } = useTheme();
  const addFamilyMember = useProfileStore((state) => state.addFamilyMember);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('father');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleIncreaseAge = () => setAge((prev) => Math.min(prev + 1, 100));
  const handleDecreaseAge = () => setAge((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    if (!name) return;
    
    addFamilyMember({
      name,
      relation: RELATIONS.find(r => r.id === relation)?.label || 'Other',
      dob: `${new Date().getFullYear() - age}-01-01`,
      age,
      gender: ['father', 'child', 'spouse'].includes(relation) ? gender : (['mother'].includes(relation) ? 'Female' : gender),
      bloodGroup,
      phone,
      medicalHistory,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
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
                onPress={() => {
                  setRelation(rel.id);
                  if (['father', 'sibling'].includes(rel.id)) setGender('Male');
                  else if (['mother'].includes(rel.id)) setGender('Female');
                }}
              >
                <Icon size={18} color={isSelected ? '#FFF' : colors.textMuted} />
                <Text style={[styles.relationText, { color: isSelected ? '#FFF' : colors.text }]}>
                  {rel.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.inputGroup}>
        {/* Name */}
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
          placeholder="Full Name"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
        />

        {/* Age Stepper */}
        <View style={[styles.ageStepperCard, { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}>
          <Text style={[styles.ageLabel, { color: colors.textSecondary }]}>Age (Years):</Text>
          <View style={styles.stepperWrap}>
            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.accent + '20' }]} onPress={handleDecreaseAge}>
              <Minus size={18} color={colors.accent} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.ageInput, { color: colors.text }]}
              value={String(age)}
              onChangeText={(val) => setAge(parseInt(val, 10) || 0)}
              keyboardType="number-pad"
              maxLength={3}
            />

            <TouchableOpacity style={[styles.stepBtn, { backgroundColor: colors.accent }]} onPress={handleIncreaseAge}>
              <Plus size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Blood Group */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Blood Group</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bloodScroll}>
          {BLOOD_GROUPS.map((bg) => (
            <TouchableOpacity
              key={bg}
              style={[
                styles.bloodChip,
                { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' },
                bloodGroup === bg && { backgroundColor: colors.accent }
              ]}
              onPress={() => setBloodGroup(bg)}
            >
              <Heart size={12} color={bloodGroup === bg ? '#FFF' : '#EF4444'} style={{ marginRight: 4 }} />
              <Text style={[styles.bloodText, { color: bloodGroup === bg ? '#FFF' : colors.text }]}>{bg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Phone / Contact */}
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
          placeholder="Phone Number (Optional)"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Medical History / Allergies */}
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
          placeholder="Known Allergies / Medical Conditions (e.g. Asthma, Diabetes)"
          placeholderTextColor={colors.textMuted}
          value={medicalHistory}
          onChangeText={setMedicalHistory}
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.accent, opacity: name ? 1 : 0.5 }]}
        onPress={handleSubmit}
        disabled={!name}
      >
        <Text style={styles.submitText}>Save Family Member</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, letterSpacing: -0.5 },
  relationContainer: { marginBottom: 20, marginHorizontal: -24 },
  relationScroll: { paddingHorizontal: 24, gap: 10 },
  relationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  relationText: { fontSize: 14, fontWeight: '600' },
  inputGroup: { gap: 14, marginBottom: 24 },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  ageStepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  ageLabel: { fontSize: 14, fontWeight: '600' },
  stepperWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  ageInput: { fontSize: 18, fontWeight: '800', width: 44, textAlign: 'center' },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginLeft: 4, marginTop: 4 },
  bloodScroll: { gap: 8 },
  bloodChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  bloodText: { fontSize: 13, fontWeight: '700' },
  submitButton: { 
    height: 56, 
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '700' }
});

