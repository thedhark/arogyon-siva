import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  withTiming,
  useSharedValue,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import {
  ArrowUp,
  Sparkles,
  Sun,
  Heart,
  Plus,
  Home,
  FileText,
  Camera,
  Image as ImageIcon,
  FileSpreadsheet,
  X,
  ChevronRight,
  Paperclip,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80';

interface GlobalChatOverlayProps {
  chatModeProgress: SharedValue<number>;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const generateAiResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return "Hello Rahul! I'm Arogyon AI, your personal clinical guide. How can I assist with your health today?";
  }
  if (q.includes('pain') || q.includes('fever') || q.includes('cough') || q.includes('headache') || q.includes('stomach') || q.includes('hurt')) {
    return "For symptoms or discomfort, consulting a specialist is best. Would you like me to connect you with an In-Clinic Specialist or GP?";
  }
  if (q.includes('book') || q.includes('doctor') || q.includes('clinic') || q.includes('appointment') || q.includes('specialist')) {
    return "You can book top-rated specialists directly under the 'Experts' tab or via In-Clinic services on the home screen.";
  }
  if (q.includes('diet') || q.includes('nutrition') || q.includes('food')) {
    return "We offer 1-on-1 personalized Ayurvedic Diet & Lifestyle plans managed by certified nutritionists in the 'Packages' tab.";
  }
  if (q.includes('lab') || q.includes('test') || q.includes('blood') || q.includes('report')) {
    return "We provide at-home sample collection for lab diagnostics. You can schedule a test directly from the Home screen.";
  }
  return "Thank you for reaching out! For precise medical guidance, I recommend booking a quick consultation with our verified doctors.";
};

const INITIAL_MESSAGES: ChatMessage[] = [];

export default function GlobalChatOverlay({ chatModeProgress, onClose }: GlobalChatOverlayProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const supportsLiquid = isLiquidGlassAvailable();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isNameLiked, setIsNameLiked] = useState(false);
  const [isQuoteLiked, setIsQuoteLiked] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [isPointerActive, setIsPointerActive] = useState(false);

  // Floating Input Bar Scroll Auto-Hide Animation
  const inputTranslateY = useSharedValue(0);
  const lastScrollY = useRef(0);

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY > 30 && diff > 8) {
      inputTranslateY.value = withTiming(100, { duration: 220, easing: Easing.out(Easing.quad) });
    } else if (diff < -5 || currentY <= 15) {
      inputTranslateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.quad) });
    }
    lastScrollY.current = currentY;
  };

  const floatingInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputTranslateY.value }],
    opacity: interpolate(inputTranslateY.value, [0, 80], [1, 0], Extrapolation.CLAMP),
  }));

  useAnimatedReaction(
    () => chatModeProgress.value > 0.05,
    (active, prev) => {
      if (active !== prev) {
        runOnJS(setIsPointerActive)(active);
      }
    },
    [chatModeProgress]
  );

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(chatModeProgress.value, [0, 1], [0, 0.65], Extrapolation.CLAMP),
  }));

  const pageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(chatModeProgress.value, [0, 1], [SCREEN_HEIGHT, 0], Extrapolation.CLAMP);
    const opacity = interpolate(chatModeProgress.value, [0, 0.15, 1], [0, 0.6, 1], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const replyText = generateAiResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 900);
  };

  const handleOpenAttachmentModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAttachmentModal(true);
  };

  const handleSelectAttachmentOption = (docType: string, label: string) => {
    setShowAttachmentModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: `📄 Attached Record: ${label}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      let aiText = `✅ ${label} successfully scanned! I've extracted your health parameters. How can I assist with this report?`;
      if (docType === 'prescription') {
        aiText = `📄 Doctor Prescription scanned! Active medications & dosage schedule extracted. Would you like me to set daily medication reminders or explain drug interactions?`;
      } else if (docType === 'lab') {
        aiText = `🧪 Diagnostic Lab Report analyzed! Hemoglobin, Blood Sugar & Lipid metrics processed. All values are within normal clinical reference ranges.`;
      } else if (docType === 'camera') {
        aiText = `📷 Physical document captured via Camera OCR! Text extracted cleanly. What guidance do you need regarding this record?`;
      } else if (docType === 'gallery') {
        aiText = `🖼️ Health record image imported from Photo Library! File attached successfully.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1100);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMessages(INITIAL_MESSAGES);
    setIsThinking(false);
  };

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.overlayWrapper]}
      pointerEvents={isPointerActive ? 'auto' : 'none'}
    >
      {/* Dimmed Backdrop */}
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>

      {/* Full Screen Ultra-Minimal AI Page */}
      <Animated.View
        style={[
          styles.fullScreenPage,
          isDark ? styles.pageDark : styles.pageLight,
          pageStyle,
        ]}
      >
        {supportsLiquid ? (
          <GlassView
            glassEffectStyle="regular"
            style={StyleSheet.absoluteFill}
          />
        ) : Platform.OS === 'ios' ? (
          <BlurView
            intensity={95}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexContainer}
        >
          {/* Main Content Area */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: Math.max(insets.top + 8, 20) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollArea}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* Top Header: Left Home Navigation Icon & Right Profile Avatar */}
            <View style={styles.topHeaderRow}>
              {/* Left Side: Home Icon Button for Navigation */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onClose();
                  router.push('/(tabs)');
                }}
                style={[
                  styles.glassHomePill,
                  {
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.6)',
                  },
                ]}
              >
                {Platform.OS === 'ios' && (
                  <BlurView intensity={70} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                )}
                <View style={styles.glassHomeContent}>
                  <Home size={18} color="#10B981" strokeWidth={2.5} />
                  <Text style={[styles.homeBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Home</Text>
                </View>
              </TouchableOpacity>

              {/* Right Side: Global Profile Avatar */}
              <TouchableOpacity
                style={styles.avatarContainer}
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                  router.push('/profile');
                }}
              >
                <View style={[styles.avatarBackdrop, { backgroundColor: isDark ? '#333' : '#E2E8F0' }]} />
                <Image source={{ uri: AVATAR_URL }} style={styles.avatar} />
              </TouchableOpacity>
            </View>

            {/* ── Greeting & Weather Cards Header ──────────────────────── */}
            <View style={styles.topCardSection}>
              {/* Greeting Header */}
              <View style={styles.greetingHeader}>
                <Text style={[styles.greetingSubtext, { color: isDark ? '#F1F5F9' : '#0F172A' }]}>
                  {getGreeting()}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsNameLiked(!isNameLiked);
                  }}
                  style={styles.nameRow}
                >
                  <Text style={styles.greetingName}>Rahul</Text>
                  <Heart
                    size={24}
                    color="#10B981"
                    fill={isNameLiked ? '#10B981' : 'none'}
                    strokeWidth={2.2}
                    style={styles.heartIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Weather & AQI Cards Row (Flat Pure White Cards) */}
              <View style={styles.widgetsRow}>
                {/* Weather Card */}
                <View
                  style={[
                    styles.widgetCard,
                    {
                      backgroundColor: isDark ? '#161B1E' : '#FFFFFF',
                    },
                  ]}
                >
                  <Sun size={32} color="#F59E0B" strokeWidth={2} />
                  <View style={[styles.widgetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]} />
                  <View style={styles.widgetTextCol}>
                    <Text style={[styles.widgetVal, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>33°C</Text>
                    <Text style={[styles.widgetSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>Sunny</Text>
                  </View>
                </View>

                {/* AQI Card */}
                <View
                  style={[
                    styles.widgetCard,
                    {
                      backgroundColor: isDark ? '#161B1E' : '#FFFFFF',
                    },
                  ]}
                >
                  <Sparkles size={30} color="#10B981" strokeWidth={2} />
                  <View style={[styles.widgetDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }]} />
                  <View style={styles.widgetTextCol}>
                    <Text style={styles.widgetValGreen}>
                      42 <Text style={[styles.widgetUnit, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>AQI</Text>
                    </Text>
                    <Text style={[styles.widgetSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                      Good <Text style={{ color: '#10B981' }}>•</Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Roast / Insight Quote Card */}
              <View
                style={[
                  styles.quoteCard,
                  {
                    backgroundColor: isDark ? '#12231A' : '#EFF8F3',
                    borderColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.12)',
                  },
                ]}
              >
                <Text style={styles.quoteMark}>“</Text>
                <Text style={[styles.quoteText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>
                  Tirupati is trying to{' '}
                  <Text style={styles.highlightWord}>roast</Text>{' '}
                  you today, but you’ve got this! 😜
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsQuoteLiked(!isQuoteLiked);
                  }}
                  style={styles.quoteHeartBtn}
                >
                  <Heart
                    size={22}
                    color="#10B981"
                    fill={isQuoteLiked ? '#10B981' : 'none'}
                    strokeWidth={2}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Pure Minimal Chat Messages (No Background Color Wrapper) ──────────────────── */}
            <View style={styles.chatSection}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.msgRow,
                      isUser ? styles.msgRowUser : styles.msgRowAi,
                    ]}
                  >
                    <View style={styles.msgBubblePure}>
                      <Text
                        style={[
                          styles.msgTextPure,
                          {
                            color: isUser
                              ? '#10B981'
                              : isDark
                              ? '#F1F5F9'
                              : '#0F172A',
                            textAlign: isUser ? 'right' : 'left',
                          },
                        ]}
                      >
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* AI Composing / Thinking Indicator */}
              {isThinking && (
                <View style={[styles.msgRow, styles.msgRowAi]}>
                  <View style={styles.msgBubblePure}>
                    <Text style={[styles.msgTextPure, { color: '#10B981', fontStyle: 'italic', fontSize: 13.5 }]}>
                      Arogyon AI is composing guidance...
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Floating Pure Capsule Input */}
          <Animated.View
            style={[
              styles.floatingInputWrapper,
              { paddingBottom: Math.max(insets.bottom, 12) },
              floatingInputStyle,
            ]}
          >
            <View
              style={[
                styles.floatingCapsule,
                {
                  backgroundColor: isDark ? '#1e2227' : '#ffffff',
                  borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(20,206,101,0.25)',
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleOpenAttachmentModal}
                style={styles.capsulePlusBtn}
              >
                <Plus size={18} color="#14ce65" />
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.capsuleInput,
                  {
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                ]}
                placeholder="Ask Arogyon AI or attach health records..."
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)'}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSend()}
                style={[
                  styles.sendCapsuleBtn,
                  { opacity: inputText.trim() ? 1 : 0.45 },
                ]}
              >
                <ArrowUp size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Ultra-Minimal ChatGPT-Style Attachment Popover Menu */}
          {showAttachmentModal && (
            <Pressable
              style={styles.attachmentModalBackdrop}
              onPress={() => setShowAttachmentModal(false)}
            >
              <Pressable
                style={[
                  styles.popoverMenuCard,
                  {
                    bottom: Math.max(insets.bottom + 68, 80),
                    backgroundColor: isDark ? '#1E2227' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
                onPress={(e) => e.stopPropagation()}
              >
                {/* Item 1: Camera */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectAttachmentOption('camera', 'Camera Photo')}
                  style={styles.popoverItemRow}
                >
                  <View style={[styles.popoverIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                    <Camera size={19} color={isDark ? '#FFFFFF' : '#0F172A'} strokeWidth={2} />
                  </View>
                  <Text style={[styles.popoverItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Camera
                  </Text>
                </TouchableOpacity>

                {/* Item 2: Photos */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectAttachmentOption('gallery', 'Photo Library')}
                  style={styles.popoverItemRow}
                >
                  <View style={[styles.popoverIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                    <ImageIcon size={19} color={isDark ? '#FFFFFF' : '#0F172A'} strokeWidth={2} />
                  </View>
                  <Text style={[styles.popoverItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Photos
                  </Text>
                </TouchableOpacity>

                {/* Item 3: Files */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectAttachmentOption('prescription', 'Files & Records')}
                  style={styles.popoverItemRow}
                >
                  <View style={[styles.popoverIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                    <Paperclip size={19} color={isDark ? '#FFFFFF' : '#0F172A'} strokeWidth={2} />
                  </View>
                  <Text style={[styles.popoverItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Files
                  </Text>
                </TouchableOpacity>

                {/* Item 4: Lab Reports */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelectAttachmentOption('lab', 'Diagnostic Lab Reports')}
                  style={styles.popoverItemRow}
                >
                  <View style={[styles.popoverIconCircle, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }]}>
                    <FileSpreadsheet size={19} color={isDark ? '#FFFFFF' : '#0F172A'} strokeWidth={2} />
                  </View>
                  <Text style={[styles.popoverItemText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    Lab Reports
                  </Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  fullScreenPage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pageDark: {
    backgroundColor: '#0b0f12',
  },
  pageLight: {
    backgroundColor: '#f6f9f7',
  },
  flexContainer: {
    flex: 1,
  },
  topFloatingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 10,
    zIndex: 10,
  },
  floatingIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 18,
  },

  /* ── Top Header Row (Home Navigation & Profile Avatar) ─────── */
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  glassHomePill: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  glassHomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 16,
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatarBackdrop: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 14,
    transform: [{ rotate: '12deg' }],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDFDFD',
  },

  /* ── Top Greeting & Weather/AQI Cards ──────────────────────── */
  topCardSection: {
    gap: 16,
    marginBottom: 8,
  },
  greetingHeader: {
    gap: 2,
  },
  greetingSubtext: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: -0.5,
  },
  heartIcon: {
    marginTop: 4,
  },
  widgetsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  widgetCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 22,
    borderWidth: 0,
  },
  widgetDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },
  widgetTextCol: {
    justifyContent: 'center',
  },
  widgetVal: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  widgetValGreen: {
    fontSize: 22,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: -0.3,
  },
  widgetUnit: {
    fontSize: 12,
    fontWeight: '700',
  },
  widgetSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
  },
  quoteMark: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10B981',
    lineHeight: 32,
    marginTop: -8,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  highlightWord: {
    color: '#FF6B00',
    fontWeight: '700',
  },
  quoteHeartBtn: {
    padding: 4,
  },

  /* ── Chat Messages (Pure Text - Zero Color Wrapper) ─────── */
  chatSection: {
    gap: 14,
    marginTop: 4,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAi: {
    justifyContent: 'flex-start',
  },
  msgBubblePure: {
    maxWidth: SCREEN_WIDTH * 0.85,
    paddingVertical: 2,
    backgroundColor: 'transparent',
  },
  msgTextPure: {
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: '500',
  },
  msgTimePure: {
    fontSize: 10.5,
    marginTop: 3,
    fontWeight: '500',
  },
  floatingInputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  floatingCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    paddingHorizontal: 14,

    ...Platform.select({
      ios: {
        shadowColor: '#14ce65',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  capsulePlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(20,206,101,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  capsuleInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '400',
  },
  sendCapsuleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#14ce65',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  /* ── Ultra-Minimal Floating Popover Menu (ChatGPT Style) ──────── */
  attachmentModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 99,
  },
  popoverMenuCard: {
    position: 'absolute',
    left: 20,
    width: 220,
    borderRadius: 28,
    padding: 8,
    borderWidth: 1,
    gap: 4,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.14,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  popoverItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  popoverIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popoverItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 14,
    letterSpacing: -0.2,
  },
});

