import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Camera, User, Mail, Phone, MapPin, Calendar, Heart, Shield, Plus, Minus, Activity, Trash2, Check, X, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import AnimatedScreen from '@/components/AnimatedScreen';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useProfileStore } from '@/hooks/useProfileStore';
import * as ImagePicker from 'expo-image-picker';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250',
];

export default function EditProfileScreen() {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);
  const updateUserProfile = useProfileStore((state) => state.updateUserProfile);
  
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [location, setLocation] = useState(userProfile.location);
  const [age, setAge] = useState(userProfile.age || 28);
  const [dob, setDob] = useState(userProfile.dob || '1998-05-15');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(userProfile.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(userProfile.bloodGroup || 'O+');
  const [height, setHeight] = useState(userProfile.height || '168 cm');
  const [weight, setWeight] = useState(userProfile.weight || '58 kg');
  const [emergencyContact, setEmergencyContact] = useState(userProfile.emergencyContact || '+91 9812345678');
  const [avatar, setAvatar] = useState(userProfile.avatar || '');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Get User Initials for fallback avatar
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Handle Age Increments/Decrements
  const handleIncreaseAge = () => {
    if (age < 120) {
      const newAge = age + 1;
      setAge(newAge);
      const currentYear = new Date().getFullYear();
      setDob(`${currentYear - newAge}-01-01`);
    }
  };

  const handleDecreaseAge = () => {
    if (age > 1) {
      const newAge = age - 1;
      setAge(newAge);
      const currentYear = new Date().getFullYear();
      setDob(`${currentYear - newAge}-01-01`);
    }
  };

  const handleDobChange = (text: string) => {
    setDob(text);
    if (text.length >= 4) {
      const birthYear = parseInt(text.slice(0, 4), 10);
      const currentYear = new Date().getFullYear();
      if (!isNaN(birthYear) && birthYear > 1900 && birthYear <= currentYear) {
        setAge(currentYear - birthYear);
      }
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
        setShowAvatarModal(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTakeCameraPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access camera is required.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
        setShowAvatarModal(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar('');
    setShowAvatarModal(false);
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setCustomAvatarUrl('');
      setShowAvatarModal(false);
    }
  };

  const handleSave = () => {
    updateUserProfile({
      name,
      email,
      phone,
      location,
      age,
      dob,
      gender,
      bloodGroup,
      height,
      weight,
      emergencyContact,
      avatar,
    });
    router.back();
  };

  return (
    <AnimatedScreen entrance="fade">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        
        {/* Header */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile Details</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Avatar Edit & Delete Section */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => setShowAvatarModal(true)}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accent }]}>
                  <Text style={styles.initialsText}>{getInitials(name)}</Text>
                </View>
              )}
              <View style={[styles.cameraButton, { backgroundColor: colors.accent, borderColor: colors.background }]}>
                <Camera size={18} color="#FFF" />
              </View>
            </TouchableOpacity>

            <View style={styles.avatarActionsRow}>
              <TouchableOpacity style={styles.changeAvatarBtn} onPress={() => setShowAvatarModal(true)}>
                <ImageIcon size={14} color={colors.accent} style={{ marginRight: 4 }} />
                <Text style={[styles.changeAvatarText, { color: colors.accent }]}>Change Photo</Text>
              </TouchableOpacity>
              {avatar ? (
                <TouchableOpacity style={styles.deleteAvatarBtn} onPress={handleDeleteAvatar}>
                  <Trash2 size={14} color="#EF4444" style={{ marginRight: 4 }} />
                  <Text style={styles.deleteAvatarText}>Remove</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.formContainer}>
            
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Full Name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            {/* Age & Date of Birth */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Age (Years)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <User size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={String(age || '')}
                    onChangeText={(val) => {
                      const num = parseInt(val, 10);
                      if (!isNaN(num)) {
                        setAge(num);
                        const currentYear = new Date().getFullYear();
                        setDob(`${currentYear - num}-01-01`);
                      } else {
                        setAge(0);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                    placeholder="Age"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Date of Birth</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <Calendar size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={dob}
                    onChangeText={handleDobChange}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Gender Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderChip,
                      { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' },
                      gender === g && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderChipText, { color: gender === g ? '#FFFFFF' : colors.text }]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Blood Group */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Blood Group</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bloodScroll}>
                {BLOOD_GROUPS.map((bg) => (
                  <TouchableOpacity
                    key={bg}
                    style={[
                      styles.bloodChip,
                      { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' },
                      bloodGroup === bg && { backgroundColor: colors.accent, borderColor: colors.accent }
                    ]}
                    onPress={() => setBloodGroup(bg)}
                  >
                    <Heart size={14} color={bloodGroup === bg ? '#FFFFFF' : '#EF4444'} style={{ marginRight: 4 }} />
                    <Text style={[styles.bloodChipText, { color: bloodGroup === bg ? '#FFFFFF' : colors.text }]}>{bg}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Height & Weight */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Height</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <Activity size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={height}
                    onChangeText={setHeight}
                    placeholder="e.g. 172 cm"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.text }]}>Weight</Text>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                  <Activity size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="e.g. 68 kg"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <Phone size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            
            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Location</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <MapPin size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Emergency Contact Number</Text>
              <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA', borderColor: isDark ? '#333' : '#F0F0F0' }]}>
                <Shield size={20} color="#EF4444" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(400)} style={[styles.footer, { borderTopColor: isDark ? '#333' : '#F0F0F0' }]}>
          <Pressable 
            style={[styles.button, { backgroundColor: colors.accent }]} 
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Save Changes</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Avatar Select / Upload / Delete Modal */}
      <Modal visible={showAvatarModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Profile Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>Select a preset photo or enter a custom image URL:</Text>

            {/* Preset Avatars Grid */}
            <View style={styles.avatarGrid}>
              {PRESET_AVATARS.map((url, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[
                    styles.avatarGridItem,
                    avatar === url && { borderColor: colors.accent, borderWidth: 3 }
                  ]}
                  onPress={() => {
                    setAvatar(url);
                    setShowAvatarModal(false);
                  }}
                >
                  <Image source={{ uri: url }} style={styles.presetImg} />
                  {avatar === url && (
                    <View style={[styles.checkBadge, { backgroundColor: colors.accent }]}>
                      <Check size={12} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Gallery Pick Button */}
            <View style={{ marginVertical: 12 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: isDark ? '#2A2A2A' : '#F3F4F6',
                  gap: 8,
                }}
                onPress={handlePickFromGallery}
              >
                <ImageIcon size={18} color={colors.accent} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Custom URL Input */}
            <View style={styles.urlFormGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Custom Image URL</Text>
              <View style={styles.urlInputRow}>
                <TextInput
                  style={[styles.urlInput, { color: colors.text, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }]}
                  placeholder="https://example.com/avatar.jpg"
                  placeholderTextColor={colors.textMuted}
                  value={customAvatarUrl}
                  onChangeText={setCustomAvatarUrl}
                />
                <TouchableOpacity style={[styles.applyBtn, { backgroundColor: colors.accent }]} onPress={handleApplyCustomUrl}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delete Photo Action */}
            {avatar ? (
              <TouchableOpacity style={styles.removePhotoModalBtn} onPress={handleDeleteAvatar}>
                <Trash2 size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={styles.removePhotoModalText}>Remove Current Photo</Text>
              </TouchableOpacity>
            ) : null}

          </View>
        </View>
      </Modal>

    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  avatarPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  changeAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeAvatarText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  ageCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
  },
  ageControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ageTextCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  ageNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  ageUnit: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageInput: {
    width: 50,
    height: 40,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  dobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 12,
  },
  dobLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  dobInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  genderChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  bloodScroll: {
    gap: 8,
  },
  bloodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  bloodChipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 14,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  avatarGridItem: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'relative',
  },
  presetImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urlFormGroup: {
    gap: 8,
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  urlInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlInput: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  applyBtn: {
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  removePhotoModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginTop: 8,
  },
  removePhotoModalText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  }
});


