import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, Mic, ArrowUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface MaterialChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onMicPress?: () => void;
}

export default function MaterialChatInput({
  value,
  onChangeText,
  onSubmit,
  onMicPress,
}: MaterialChatInputProps) {
  const { isDark, colors } = useTheme();

  // Material 3 Surface colors
  const containerBg = isDark ? '#2A2A2A' : '#F0F0F0';
  const iconColor = isDark ? '#E5E7EB' : '#4B5563';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.wrapper}
    >
      <View style={[styles.container, { backgroundColor: containerBg }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <Plus size={24} color={iconColor} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Ask Arogyon AI"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />
        
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={onMicPress}>
            <Mic size={22} color={iconColor} />
          </TouchableOpacity>
          {value.trim().length > 0 && (
            <TouchableOpacity style={styles.activeBtn} onPress={onSubmit}>
               <View style={styles.sendIconWrapper}>
                 <ArrowUp size={18} color="#FFF" /> 
               </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999, // Pill shape
    paddingHorizontal: 4,
    paddingVertical: 6,
    minHeight: 52,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 8,
    maxHeight: 100, // Limit height when multiline expands
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
  },
  activeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#10B981', // Matching Arogyon green
    alignItems: 'center',
    justifyContent: 'center',
  }
});
