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
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  ArrowUp,
  Sparkles,
  RefreshCw,
  Search,
  FileText,
  ChevronRight,
  Clock,
  CheckCircle2,
  Menu,
  BookOpen,
  Calendar,
  Pill,
  MessageSquare,
  Plus,
  Paperclip,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { ThinkingOrb, OrbState } from '@/components/ui/ThinkingOrb';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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

interface SavedRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  doctor: string;
}

interface PastSession {
  id: string;
  title: string;
  date: string;
  snippet: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const MOCK_PAST_SESSIONS: PastSession[] = [
  {
    id: 's1',
    title: 'Pregnancy Care & Nutrition Advice',
    date: 'Yesterday, 4:15 PM',
    snippet: 'Recommended trimesters diet plan & prenatal vitamins',
  },
  {
    id: 's2',
    title: 'In-Clinic General Physician Booking',
    date: '18 Jul 2026',
    snippet: 'Found Apollo Clinic specialists near Indiranagar',
  },
  {
    id: 's3',
    title: 'Full Body Blood Diagnostic Test Query',
    date: '14 Jul 2026',
    snippet: 'Analyzed lipid profile & HbA1c lab test options',
  },
];

const MOCK_RECORDS: SavedRecord[] = [
  {
    id: 'r1',
    title: 'Comprehensive Lipid Profile Report',
    category: 'Lab Report',
    date: '20 Jul 2026',
    doctor: 'Apollo Diagnostics',
  },
  {
    id: 'r2',
    title: 'Ayurvedic Diet & Lifestyle Plan',
    category: 'Prescription',
    date: '15 Jul 2026',
    doctor: 'Dr. Ananya Sharma',
  },
  {
    id: 'r3',
    title: 'Cardiology ECG Consultation Summary',
    category: 'Clinical Summary',
    date: '02 Jun 2026',
    doctor: 'Dr. Vikram Patel',
  },
];

const MOCK_SCHEDULES: ScheduleItem[] = [
  {
    id: 'sc1',
    title: 'General Physician Routine Checkup',
    type: 'In-Clinic Appointment',
    date: 'Tomorrow, 23 Jul',
    time: '10:30 AM',
  },
  {
    id: 'sc2',
    title: 'At-Home Lipid & Blood Sample Collection',
    type: 'Lab Test Collection',
    date: 'Sat, 25 Jul',
    time: '08:00 AM',
  },
];

const QUICK_PROMPTS = [
  '🩺 How to manage blood pressure naturally?',
  '🧪 Book Indiranagar Full Body Lab Test',
  '🥗 View personalized trimester diet plan',
  '🏥 Find top pediatricians near me',
];

const generateAiResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return "Hello! I'm Arogyon AI, your personal clinical guide. How can I assist with your health today?";
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

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'ai',
    text: "Hi Ananya! I'm Arogyon AI. How can I support your health and wellness journey today?",
    timestamp: 'Just now',
  },
];

export default function GlobalChatOverlay({ chatModeProgress, onClose }: GlobalChatOverlayProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const supportsLiquid = isLiquidGlassAvailable();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'chats' | 'library' | 'prescriptions' | 'schedules'>('chats');
  const scrollViewRef = useRef<ScrollView>(null);

  const [isPointerActive, setIsPointerActive] = useState(false);

  // Floating Input Bar Scroll Auto-Hide Animation
  const inputTranslateY = useSharedValue(0);
  const lastScrollY = useRef(0);

  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (currentY > 30 && diff > 8) {
      // Scrolling down: hide floating input capsule smoothly
      inputTranslateY.value = withTiming(100, { duration: 220, easing: Easing.out(Easing.quad) });
    } else if (diff < -5 || currentY <= 15) {
      // Scrolling up or at top: show floating input capsule smoothly
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

  // Animated full-screen page transitions
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

  const handleAttachment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const attachmentMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: '📄 Uploading prescription PDF / health records...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, attachmentMsg]);
    setIsThinking(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '✅ Prescription & Report attached! I have scanned your diagnostics and medications. How would you like me to assist with this document?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
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

  const toggleSidebar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowSidebar(!showSidebar);
  };

  const loadSession = (session: PastSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSidebar(false);
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: `Loaded session: "${session.title}"`,
        timestamp: session.date,
      },
      {
        id: '2',
        sender: 'ai',
        text: `Summary: ${session.snippet}`,
        timestamp: session.date,
      },
    ]);
  };

  const loadRecord = (rec: SavedRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSidebar(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `📄 Referenced File: ${rec.title} (${rec.category}) from ${rec.doctor} (${rec.date}). How would you like me to assist with this report?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
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
          {/* Header Layout: Left (Sidebar Toggle), Middle (Orb + Title), Right (Cancel) */}
          <View
            style={[
              styles.header,
              {
                paddingTop: Math.max(insets.top + 6, 18),
              },
            ]}
          >
            {/* Left Side: Sidebar Toggle Menu Button */}
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleSidebar}
              style={[
                styles.iconBtn,
                showSidebar && styles.activeIconBtn,
                { backgroundColor: showSidebar ? '#14ce65' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' },
              ]}
            >
              <Menu size={20} color={showSidebar ? '#ffffff' : isDark ? '#ffffff' : '#0f172a'} />
            </TouchableOpacity>

            {/* Middle: Live Thinking Orb + Arogyon AI Title */}
            <View style={styles.headerCenterGroup}>
              <ThinkingOrb state={isThinking ? 'composing' : 'listening'} size={36} />
              <View style={{ alignItems: 'center' }}>
                <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  Arogyon AI
                </Text>
                <Text style={[styles.headerSub, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(15,23,42,0.5)' }]}>
                  {isThinking ? 'Analyzing query...' : 'Clinical Assistant'}
                </Text>
              </View>
            </View>

            {/* Right Side: Reset & Cancel Close Button */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleReset}
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}
              >
                <RefreshCw size={16} color={isDark ? '#aaaaaa' : '#666666'} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onClose}
                style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }]}
              >
                <X size={20} color={isDark ? '#ffffff' : '#0f172a'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Container Area (Chat or Sidebar Drawer) */}
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* Sliding Sidebar Drawer */}
            {showSidebar && (
              <View
                style={[
                  styles.sidebarContainer,
                  {
                    backgroundColor: isDark ? '#14171a' : '#f8fafc',
                    borderRightColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  },
                ]}
              >
                {/* Sidebar Navigation Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sidebarTabsScroll}>
                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveSidebarTab('chats'); }}
                    style={[styles.sidebarTabBtn, activeSidebarTab === 'chats' && styles.activeSidebarTabBtn]}
                  >
                    <MessageSquare size={14} color={activeSidebarTab === 'chats' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'} />
                    <Text style={[styles.sidebarTabText, { color: activeSidebarTab === 'chats' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b' }]}>
                      Chats
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveSidebarTab('library'); }}
                    style={[styles.sidebarTabBtn, activeSidebarTab === 'library' && styles.activeSidebarTabBtn]}
                  >
                    <BookOpen size={14} color={activeSidebarTab === 'library' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'} />
                    <Text style={[styles.sidebarTabText, { color: activeSidebarTab === 'library' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b' }]}>
                      Library
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveSidebarTab('prescriptions'); }}
                    style={[styles.sidebarTabBtn, activeSidebarTab === 'prescriptions' && styles.activeSidebarTabBtn]}
                  >
                    <Pill size={14} color={activeSidebarTab === 'prescriptions' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'} />
                    <Text style={[styles.sidebarTabText, { color: activeSidebarTab === 'prescriptions' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b' }]}>
                      Rx
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveSidebarTab('schedules'); }}
                    style={[styles.sidebarTabBtn, activeSidebarTab === 'schedules' && styles.activeSidebarTabBtn]}
                  >
                    <Calendar size={14} color={activeSidebarTab === 'schedules' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b'} />
                    <Text style={[styles.sidebarTabText, { color: activeSidebarTab === 'schedules' ? '#ffffff' : isDark ? '#94a3b8' : '#64748b' }]}>
                      Schedule
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {/* Sidebar Drawer List Items */}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 10 }}>
                  {activeSidebarTab === 'chats' &&
                    MOCK_PAST_SESSIONS.map((session) => (
                      <TouchableOpacity
                        key={session.id}
                        activeOpacity={0.8}
                        onPress={() => loadSession(session)}
                        style={[
                          styles.sidebarCard,
                          {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          },
                        ]}
                      >
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={[styles.sidebarCardTitle, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
                            {session.title}
                          </Text>
                          <Text style={[styles.sidebarCardSnippet, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {session.snippet}
                          </Text>
                          <Text style={styles.sidebarCardDate}>{session.date}</Text>
                        </View>
                        <ChevronRight size={16} color="#14ce65" />
                      </TouchableOpacity>
                    ))}

                  {(activeSidebarTab === 'library' || activeSidebarTab === 'prescriptions') &&
                    MOCK_RECORDS.map((rec) => (
                      <TouchableOpacity
                        key={rec.id}
                        activeOpacity={0.8}
                        onPress={() => loadRecord(rec)}
                        style={[
                          styles.sidebarCard,
                          {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          },
                        ]}
                      >
                        <View style={{ flex: 1, gap: 2 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={13} color="#14ce65" />
                            <Text style={[styles.sidebarCardTitle, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
                              {rec.title}
                            </Text>
                          </View>
                          <Text style={[styles.sidebarCardSnippet, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {rec.category} • {rec.doctor}
                          </Text>
                          <Text style={styles.sidebarCardDate}>{rec.date}</Text>
                        </View>
                        <ChevronRight size={16} color="#14ce65" />
                      </TouchableOpacity>
                    ))}

                  {activeSidebarTab === 'schedules' &&
                    MOCK_SCHEDULES.map((sch) => (
                      <View
                        key={sch.id}
                        style={[
                          styles.sidebarCard,
                          {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                          },
                        ]}
                      >
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={[styles.sidebarCardTitle, { color: isDark ? '#f1f5f9' : '#0f172a' }]}>
                            {sch.title}
                          </Text>
                          <Text style={[styles.sidebarCardSnippet, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {sch.type}
                          </Text>
                          <Text style={styles.sidebarCardDate}>
                            {sch.date} at {sch.time}
                          </Text>
                        </View>
                      </View>
                    ))}
                </ScrollView>
              </View>
            )}

            {/* Main Chat Scroll View */}
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={styles.scrollArea}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
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
                    {!isUser && (
                      <View style={styles.aiAvatar}>
                        <Sparkles size={14} color="#14ce65" />
                      </View>
                    )}

                    <View
                      style={[
                        styles.msgBubble,
                        isUser
                          ? styles.userBubble
                          : [
                              styles.aiBubble,
                              {
                                backgroundColor: isDark
                                  ? 'rgba(255,255,255,0.07)'
                                  : 'rgba(240,245,242,0.9)',
                                borderColor: isDark
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(20,206,101,0.2)',
                              },
                            ],
                      ]}
                    >
                      <Text
                        style={[
                          styles.msgText,
                          { color: isUser ? '#ffffff' : isDark ? '#f1f5f9' : '#0f172a' },
                        ]}
                      >
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* AI Thinking Indicator bubble */}
              {isThinking && (
                <View style={[styles.msgRow, styles.msgRowAi]}>
                  <View style={styles.aiAvatar}>
                    <Sparkles size={14} color="#14ce65" />
                  </View>
                  <View
                    style={[
                      styles.msgBubble,
                      styles.aiBubble,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(240,245,242,0.9)',
                        borderColor: 'rgba(20,206,101,0.3)',
                      },
                    ]}
                  >
                    <Text style={[styles.msgText, { color: '#14ce65', fontStyle: 'italic', fontSize: 13.5 }]}>
                      Analyzing health query...
                    </Text>
                  </View>
                </View>
              )}

              {/* Ultra Minimal Quick Prompt Pills */}
              {messages.length === 1 && !isThinking && (
                <View style={styles.quickPromptsContainer}>
                  {QUICK_PROMPTS.map((promptText, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => handleSend(promptText.replace(/^[^\w\s]+/, '').trim())}
                      style={[
                        styles.promptPill,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(20,206,101,0.06)',
                          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,206,101,0.2)',
                        },
                      ]}
                    >
                      <Text style={[styles.promptPillText, { color: isDark ? '#e2e8f0' : '#0f172a' }]}>
                        {promptText}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>

          {/* Floating Pure Capsule Input (Zero Background Wrapper / Zero Container) */}
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
              {/* Plus Attachment Button for Uploading Docs, Images & Prescriptions */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleAttachment}
                style={styles.capsulePlusBtn}
              >
                <Plus size={18} color="#14ce65" />
              </TouchableOpacity>

              {/* Pure Search & Chat Input */}
              <TextInput
                style={[
                  styles.capsuleInput,
                  {
                    color: isDark ? '#ffffff' : '#0f172a',
                  },
                ]}
                placeholder='Ask Arogyon AI or attach health records...'
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(15,23,42,0.45)'}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />

              {/* Send Button */}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerCenterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBtn: {
    backgroundColor: '#14ce65',
  },
  sidebarContainer: {
    width: SCREEN_WIDTH * 0.76,
    borderRightWidth: 1,
  },
  sidebarTabsScroll: {
    maxHeight: 46,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  sidebarTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
  },
  activeSidebarTabBtn: {
    backgroundColor: '#14ce65',
  },
  sidebarTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sidebarCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sidebarCardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  sidebarCardSnippet: {
    fontSize: 11.5,
    fontWeight: '400',
  },
  sidebarCardDate: {
    fontSize: 10,
    color: '#14ce65',
    fontWeight: '500',
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAi: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(20,206,101,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  msgBubble: {
    maxWidth: SCREEN_WIDTH * 0.78,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#14ce65',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  msgText: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: '400',
  },
  quickPromptsContainer: {
    marginTop: 18,
    gap: 10,
  },
  promptPill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  promptPillText: {
    fontSize: 13.5,
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
});
