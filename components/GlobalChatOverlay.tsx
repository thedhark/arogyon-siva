import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Modal } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Sparkles, Activity, FileText, Stethoscope, ChevronDown, Search, BookOpen, Clock, Menu, Plus, ChevronLeft } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Mask, Rect, Path, Circle } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

function AiAvatar() {
  return (
    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 4 }}>
      <Svg width={24} height={24} viewBox="0 0 44 44">
        <Defs>
          <LinearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#9bf229" />
            <Stop offset="100%" stopColor="#14ce65" />
          </LinearGradient>
          <Mask id="heart-mask">
            <Rect width="44" height="44" fill="white" />
            <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
          </Mask>
        </Defs>
        <Circle cx="22" cy="22" r="22" fill="url(#o-grad)" mask="url(#heart-mask)" />
      </Svg>
    </View>
  );
}

const { height, width } = Dimensions.get('window');

interface Props {
  chatModeProgress: SharedValue<number>;
  onClose: () => void;
}

const SUGGESTIONS = [
  { id: '1', title: 'Track Symptoms', icon: Activity },
  { id: '2', title: 'Find Doctors', icon: Stethoscope },
  { id: '3', title: 'My Records', icon: FileText },
  { id: '4', title: 'Diet Plan', icon: BookOpen },
  { id: '5', title: 'Analyze Reports', icon: Search },
  { id: '6', title: 'Reminders', icon: Clock },
];

export default function GlobalChatOverlay({ chatModeProgress, onClose }: Props) {
  const { colors, isDark } = useTheme();
  
  const [messages, setMessages] = useState<any[]>([]);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarProgress = useSharedValue(0);

  const handleMenuToggle = () => {
    if (isSidebarOpen) {
      sidebarProgress.value = withTiming(0, { duration: 300 });
      setTimeout(() => setIsSidebarOpen(false), 300);
    } else {
      setIsSidebarOpen(true);
      sidebarProgress.value = withTiming(1, { duration: 300 });
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    handleMenuToggle();
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: chatModeProgress.value,
      pointerEvents: chatModeProgress.value > 0.5 ? 'auto' : 'none',
      backgroundColor: colors.background,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(chatModeProgress.value, [0, 1], [100, 0], Extrapolation.CLAMP) },
        { scale: interpolate(chatModeProgress.value, [0, 1], [0.95, 1], Extrapolation.CLAMP) }
      ],
      opacity: interpolate(chatModeProgress.value, [0.2, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  const suggestionsStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(chatModeProgress.value, [0, 1], [150, 0], Extrapolation.CLAMP) }
      ],
      opacity: interpolate(chatModeProgress.value, [0.4, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: sidebarProgress.value,
  }));

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(sidebarProgress.value, [0, 1], [-width, 0], Extrapolation.CLAMP) }]
  }));

  const handleSuggestionPress = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender: 'user' }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "I can certainly help with that. Let's get started.", sender: 'ai' }]);
    }, 800);
  };

  return (
    <>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.content, contentStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleMenuToggle} style={styles.menuBtn}>
              <Menu size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={[styles.headerTitleRow, { alignItems: 'center' }]}>
            <Text style={{ fontSize: 26, fontWeight: '900', letterSpacing: 2, marginRight: -2, textShadowColor: 'rgba(16,185,129,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
              <Text style={{ color: '#009f68' }}>A</Text>
              <Text style={{ color: '#059669' }}>R</Text>
              <Text style={{ color: '#10B981' }}>O</Text>
              <Text style={{ color: '#14ce65' }}>G</Text>
              <Text style={{ color: '#9bf229' }}>Y</Text>
            </Text>
            <Svg width={50} height={24} viewBox="0 0 92 44">
              <Defs>
                <LinearGradient id="o-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#9bf229" />
                  <Stop offset="100%" stopColor="#14ce65" />
                </LinearGradient>
                <Mask id="heart-mask">
                  <Rect width="92" height="44" fill="white" />
                  <Path d="M 22 14 C 15 8, 7 13, 9 21 C 11 28, 19 33, 22 37 C 25 33, 33 28, 35 21 C 37 13, 29 8, 22 14 Z" fill="black" />
                </Mask>
                <LinearGradient id="n-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#1ad561" />
                  <Stop offset="100%" stopColor="#009f68" />
                </LinearGradient>
              </Defs>
              <Circle cx="22" cy="22" r="22" fill="url(#o-grad)" mask="url(#heart-mask)" />
              <Path 
                d="M 56 38.5 V 18.5 A 13 13 0 0 1 82 18.5 V 38.5" 
                fill="none" 
                stroke="url(#n-grad)" 
                strokeWidth="11" 
                strokeLinecap="round" 
              />
            </Svg>
          </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <ChevronDown size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Chat Area */}
        <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          {messages.length === 0 ? (
            <Animated.View style={[styles.suggestionsGrid, suggestionsStyle]}>
              {SUGGESTIONS.map(s => (
                <TouchableOpacity key={s.id} style={[styles.suggestionCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#E5E7EB' }]} onPress={() => handleSuggestionPress(s.title)}>
                  <View style={styles.suggestionIconWrapper}>
                    <s.icon size={16} color="#10B981" />
                  </View>
                  <Text style={[styles.suggestionCardText, { color: colors.text }]} numberOfLines={2}>{s.title}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ) : (
            messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <View style={[styles.messageRow, { justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }]}>
                  {msg.sender === 'ai' && <AiAvatar />}
                  {msg.sender === 'user' ? (
                    <ExpoLinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.messageBubble, styles.userBubble]}
                    >
                      <Text style={[styles.messageText, styles.userText]}>{msg.text}</Text>
                    </ExpoLinearGradient>
                  ) : (
                    <View style={[styles.messageBubble, styles.aiBubble, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#333' : '#F3F4F6' }]}>
                      <Text style={[styles.messageText, { color: colors.text }]}>{msg.text}</Text>
                    </View>
                  )}
                </View>
              </React.Fragment>
            ))
          )}
        </ScrollView>
        </Animated.View>
      </Animated.View>

      {/* Full Screen Sidebar using Modal */}
      <Modal visible={isSidebarOpen} transparent animationType="none" onRequestClose={handleMenuToggle}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleMenuToggle} activeOpacity={1} />
        </Animated.View>

        <Animated.View style={[styles.sidebarPanel, { backgroundColor: isDark ? '#121212' : '#FDFDFD' }, sidebarStyle]}>
          <View style={styles.sidebarHeader}>
            {/* Empty view for flex-between spacing if needed, or left-aligned close */}
            <TouchableOpacity onPress={handleMenuToggle} style={styles.sidebarClose}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity activeOpacity={0.8} onPress={handleNewChat} style={styles.newChatBtnWrapper}>
            <ExpoLinearGradient
              colors={['#9bf229', '#009f68']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newChatGradient}
            >
              <View style={[styles.newChatInner, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
                <Plus size={20} color="#10B981" />
                <Text style={[styles.newChatText, { color: colors.text }]}>New Chat</Text>
              </View>
            </ExpoLinearGradient>
          </TouchableOpacity>

          <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sidebarSectionTitle, { color: colors.textMuted }]}>Medical Records</Text>
            <TouchableOpacity style={styles.sidebarItemRow}>
              <FileText size={18} color={colors.textMuted} />
              <Text style={[styles.sidebarItemText, { color: colors.text }]}>My Prescriptions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItemRow}>
              <Activity size={18} color={colors.textMuted} />
              <Text style={[styles.sidebarItemText, { color: colors.text }]}>Lab Reports</Text>
            </TouchableOpacity>
            
            <Text style={[styles.sidebarSectionTitle, { color: colors.textMuted, marginTop: 24 }]}>History</Text>
            <TouchableOpacity style={styles.sidebarItemRow}>
              <Clock size={18} color={colors.textMuted} />
              <Text style={[styles.sidebarItemText, { color: colors.text }]}>Today's Vitals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItemRow}>
              <Clock size={18} color={colors.textMuted} />
              <Text style={[styles.sidebarItemText, { color: colors.text }]}>Orthopedic Search</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -150, // extend behind the tab bar
    left: -10, // counteract wrapper padding
    right: -10,
    height: height + 150, // Full screen height
    zIndex: 900, // Below the morphing logo, but above everything else
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 150, // space for tab bar morph
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8, // slight adjustment to align well
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  suggestionsGrid: {
    marginTop: 20,
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  suggestionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  suggestionCardText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sidebarClose: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -8,
  },
  newChatBtnWrapper: {
    marginBottom: 32,
  },
  newChatGradient: {
    padding: 2,
    borderRadius: 20,
  },
  newChatInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 18,
    gap: 8,
  },
  newChatText: {
    fontWeight: '700',
    fontSize: 16,
  },
  sidebarScroll: {
    flex: 1,
  },
  sidebarSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sidebarItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  sidebarItemText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
