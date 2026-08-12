import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { User, Calendar, ChevronDown, X, Heart } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface NewFamilyMemberPayload {
  name: string;
  relation: string;
  dob: string;
  gender: string;
  phone?: string;
  age: number;
}

interface AddFamilyMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (member: NewFamilyMemberPayload) => void;
}

const RELATION_OPTIONS = ['Mother', 'Father', 'Spouse', 'Child', 'Sibling', 'Other'];
const GENDER_OPTIONS = ['Female', 'Male', 'Other'];

export default function AddFamilyMemberModal({
  visible,
  onClose,
  onSubmit,
}: AddFamilyMemberModalProps) {
  const { colors, isDark } = useTheme();

  const [relation, setRelation] = useState('Mother');
  const [fullName, setFullName] = useState('Ananya Doe');
  const [dob, setDob] = useState('12 May 1998');
  const [gender, setGender] = useState('Female');
  const [phone, setPhone] = useState('98765 43210');

  const [showRelationPicker, setShowRelationPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  if (!visible) return null;

  const calculateAge = (dobString: string): number => {
    // Basic fallback parsing for "12 May 1998" or "1998-05-12"
    const matches = dobString.match(/\b(19|20)\d{2}\b/);
    if (matches && matches[0]) {
      const birthYear = parseInt(matches[0], 10);
      return Math.max(1, new Date().getFullYear() - birthYear);
    }
    return 26;
  };

  const handleAddMember = () => {
    if (!fullName.trim()) return;

    const age = calculateAge(dob);
    onSubmit({
      name: fullName.trim(),
      relation,
      dob,
      gender,
      phone: phone.trim() ? `+91 ${phone.trim()}` : undefined,
      age,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdropPressable} onPress={onClose} activeOpacity={1} />

        <View style={[styles.sheetContainer, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
          {/* Drag Pill */}
          <View style={styles.dragPillWrapper}>
            <View style={[styles.dragPill, { backgroundColor: isDark ? '#444' : '#D1D5DB' }]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Add Family Member</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Relationship Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Relationship</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownInput,
                  {
                    backgroundColor: isDark ? '#262626' : '#FAFAFA',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                  },
                ]}
                onPress={() => {
                  setShowRelationPicker(!showRelationPicker);
                  setShowGenderPicker(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownLeft}>
                  <User size={18} color="#6B7280" />
                  <Text style={[styles.inputText, { color: colors.text }]}>{relation}</Text>
                </View>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>

              {showRelationPicker && (
                <View style={[styles.optionsDropdown, { backgroundColor: isDark ? '#2D2D2D' : '#F9FAFB' }]}>
                  {RELATION_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.optionItem}
                      onPress={() => {
                        setRelation(opt);
                        if (opt === 'Mother' || opt === 'Spouse') setGender('Female');
                        else if (opt === 'Father') setGender('Male');
                        setShowRelationPicker(false);
                      }}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Full Name Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#262626' : '#FAFAFA',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                    color: colors.text,
                  },
                ]}
                placeholder="Full Name"
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Date of Birth Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <View
                style={[
                  styles.iconInputBox,
                  {
                    backgroundColor: isDark ? '#262626' : '#FAFAFA',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                  },
                ]}
              >
                <Calendar size={18} color="#6B7280" style={{ marginRight: 10 }} />
                <TextInput
                  style={[styles.flexInput, { color: colors.text }]}
                  placeholder="e.g. 12 May 1998"
                  placeholderTextColor="#9CA3AF"
                  value={dob}
                  onChangeText={setDob}
                />
              </View>
            </View>

            {/* Gender Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <TouchableOpacity
                style={[
                  styles.dropdownInput,
                  {
                    backgroundColor: isDark ? '#262626' : '#FAFAFA',
                    borderColor: isDark ? '#333' : '#E5E7EB',
                  },
                ]}
                onPress={() => {
                  setShowGenderPicker(!showGenderPicker);
                  setShowRelationPicker(false);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownLeft}>
                  <View style={styles.pinkIconWrapper}>
                    <Heart size={14} color="#EC4899" />
                  </View>
                  <Text style={[styles.inputText, { color: colors.text }]}>{gender}</Text>
                </View>
                <ChevronDown size={18} color="#6B7280" />
              </TouchableOpacity>

              {showGenderPicker && (
                <View style={[styles.optionsDropdown, { backgroundColor: isDark ? '#2D2D2D' : '#F9FAFB' }]}>
                  {GENDER_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.optionItem}
                      onPress={() => {
                        setGender(opt);
                        setShowGenderPicker(false);
                      }}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Mobile Number Field (Optional) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile Number (Optional)</Text>
              <View style={styles.phoneRow}>
                <View
                  style={[
                    styles.countryCodeBox,
                    {
                      backgroundColor: isDark ? '#262626' : '#FAFAFA',
                      borderColor: isDark ? '#333' : '#E5E7EB',
                    },
                  ]}
                >
                  <Text style={[styles.countryCodeText, { color: colors.text }]}>+91</Text>
                </View>
                <TextInput
                  style={[
                    styles.phoneInput,
                    {
                      backgroundColor: isDark ? '#262626' : '#FAFAFA',
                      borderColor: isDark ? '#333' : '#E5E7EB',
                      color: colors.text,
                    },
                  ]}
                  placeholder="98765 43210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={[styles.addMemberBtn, { opacity: fullName.trim() ? 1 : 0.6 }]}
              onPress={handleAddMember}
              disabled={!fullName.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.addMemberBtnText}>Add Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '85%',
  },
  dragPillWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragPill: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    maxHeight: 460,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 6,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinkIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  textInput: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  iconInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  flexInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCodeBox: {
    width: 60,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  phoneInput: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  optionsDropdown: {
    borderRadius: 12,
    marginTop: 4,
    paddingVertical: 4,
    elevation: 3,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addMemberBtn: {
    backgroundColor: '#0D9488',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  addMemberBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
