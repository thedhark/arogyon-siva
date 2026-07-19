import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Wand2, Image, Paperclip, Mic, ArrowUp } from 'lucide-react-native';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
}

export default function ChatInputBar({ onSendMessage }: ChatInputBarProps) {
  const { colors, isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const supportsLiquidGlass = isLiquidGlassAvailable();

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const containerBgStyle = supportsLiquidGlass 
    ? styles.glassTransparent 
    : (Platform.OS === 'ios' ? styles.blurContainer : (isDark ? styles.softGlassDark : styles.softGlassLight));

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.inputCard, containerBgStyle]}>
        {supportsLiquidGlass && (
          <GlassView glassEffectStyle="regular" isInteractive={false} style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]} />
        )}
        {!supportsLiquidGlass && Platform.OS === 'ios' && (
          <BlurView intensity={85} tint={isDark ? 'dark' : 'light'} style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]} />
        )}

        {/* Top Row: Wand Icon + TextInput */}
        <View style={styles.inputTopRow}>

          <TextInput
            ref={inputRef}
            style={[styles.textInput, { color: colors.text }]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
        </View>

        {/* Bottom Row: Tool Icons + Send Button */}
        <View style={styles.inputBottomRow}>
          <View style={styles.toolIconsContainer}>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Paperclip size={20} color={isDark ? '#A1A1AA' : '#4B5563'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolIconBtn}>
              <Mic size={20} color={isDark ? '#A1A1AA' : '#4B5563'} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.newSendBtn}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <ExpoLinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendBtnGradient}
            >
              <ArrowUp size={20} color="#FFFFFF" strokeWidth={2.5} />
            </ExpoLinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    paddingHorizontal: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
  },
  inputCard: {
    width: '100%',
    height: 114,
    borderRadius: 28,
    borderCurve: 'continuous',
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  softGlassLight: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  softGlassDark: {
    backgroundColor: '#1e1e1e',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  glassTransparent: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  blurContainer: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
    }),
  },
  inputTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  sparklesIcon: {
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingHorizontal: 8,
  },
  inputBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 44,
    marginTop: 4,
  },
  toolIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendBtnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
