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
import { formatTime, formatDisplayDate } from '@/utils';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { readDocumentOnDevice, extractStructuredInsights } from '@/services/documentReaderService';
import { useRecordsStore } from '@/hooks/useRecordsStore';
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
import { Alert } from 'react-native';

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
  attachment?: {
    uri: string;
    name: string;
    type: 'image' | 'document';
    category?: string;
    summary?: string;
  };
}

const generateAiResponse = (query: string): string => {
  const q = query.toLowerCase();

  // Check stored records for medical document questions
  if (
    q.includes('report') ||
    q.includes('record') ||
    q.includes('prescription') ||
    q.includes('lab') ||
    q.includes('blood') ||
    q.includes('test') ||
    q.includes('extract') ||
    q.includes('document') ||
    q.includes('summary')
  ) {
    const savedRecords = useRecordsStore.getState().records;
    if (savedRecords.length > 0) {
      const recordSummaries = savedRecords.slice(0, 3).map((r, i) => {
        const textSnippet = r.summary || (r.extractedText ? r.extractedText.slice(0, 100) : 'Document stored securely');
        return `${i + 1}. ${r.title} (${r.category})\n   • Summary: ${textSnippet}`;
      }).join('\n');
      return `📁 Found ${savedRecords.length} medical record(s) saved in your vault:\n\n${recordSummaries}\n\nWould you like me to analyze any specific parameters or connected doctor recommendations?`;
    }
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return "Hello Rahul! How can I assist with your health today?";
  }
  if (q.includes('pain') || q.includes('fever') || q.includes('cough') || q.includes('headache') || q.includes('stomach') || q.includes('hurt')) {
    return "For medical symptoms, consulting a specialist is recommended. Would you like to connect with a doctor?";
  }
  if (q.includes('book') || q.includes('doctor') || q.includes('clinic') || q.includes('appointment') || q.includes('specialist')) {
    return "You can book top-rated specialists directly under the 'Experts' tab.";
  }
  if (q.includes('diet') || q.includes('nutrition') || q.includes('food')) {
    return "Personalized diet plans are available under the 'Packages' tab.";
  }
  if (q.includes('lab') || q.includes('test') || q.includes('blood') || q.includes('report')) {
    return "At-home lab test bookings are available from the Home screen.";
  }
  return "I've reviewed your request. How can I assist you with your health records, appointments, or medical questions?";
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
      timestamp: formatTime(new Date()),
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
        timestamp: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 900);
  };

  const addRecord = useRecordsStore((state) => state.addRecord);

  const handleOpenAttachmentModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAttachmentModal(true);
  };

  const handleSelectAttachmentOption = async (docType: string, label: string) => {
    setShowAttachmentModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let fileToProcess: { uri: string; name: string; type: string; isImage: boolean } | null = null;

    try {
      if (docType === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Camera Permission Required', 'Please enable camera access in your settings to capture medical records.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          fileToProcess = {
            uri: asset.uri,
            name: asset.fileName || `Camera_Scan_${Date.now()}.jpg`,
            type: 'image/jpeg',
            isImage: true,
          };
        }
      } else if (docType === 'gallery') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow photo library access to attach photos.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          fileToProcess = {
            uri: asset.uri,
            name: asset.fileName || `Photo_Record_${Date.now()}.jpg`,
            type: 'image/jpeg',
            isImage: true,
          };
        }
      } else if (docType === 'prescription' || docType === 'lab') {
        const mimeTypes = docType === 'lab'
          ? ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
          : ['*/*'];
        const result = await DocumentPicker.getDocumentAsync({
          type: mimeTypes,
          copyToCacheDirectory: true,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          const isImage = (asset.mimeType || '').startsWith('image/') || asset.name.match(/\.(jpg|jpeg|png|webp|heic)$/i) !== null;
          fileToProcess = {
            uri: asset.uri,
            name: asset.name,
            type: asset.mimeType || 'application/octet-stream',
            isImage,
          };
        }
      }
    } catch (error) {
      console.warn('Attachment picking failed:', error);
      return;
    }

    if (!fileToProcess) return;

    const selected = fileToProcess;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: '',
      timestamp: formatTime(new Date()),
      attachment: {
        uri: selected.uri,
        name: selected.name,
        type: selected.isImage ? 'image' : 'document',
      },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Perform on-device OCR scan
    const ocrResult = await readDocumentOnDevice(selected);

    // Update message attachment category & summary
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === userMsg.id && msg.attachment
          ? {
              ...msg,
              attachment: {
                ...msg.attachment,
                category: ocrResult.category,
                summary: ocrResult.summary,
              },
            }
          : msg
      )
    );

    // Persist to central Records Store
    addRecord({
      title: ocrResult.suggestedTitle || selected.name,
      date: formatDisplayDate(new Date()),
      category: ocrResult.category,
      fileUri: selected.uri,
      fileName: selected.name,
      extractedText: ocrResult.extractedText,
      summary: ocrResult.summary,
      tags: ocrResult.tags,
    });

    const insights = extractStructuredInsights(ocrResult.extractedText);
    let aiText = `📄 Extracted Insights from "${selected.name}":\n• Category: ${ocrResult.category}\n• Summary: ${ocrResult.summary}`;
    
    if (insights.doctorName) {
      aiText += `\n• Doctor: ${insights.doctorName}`;
    }
    if (insights.testValues.length > 0) {
      aiText += `\n• Detected Parameters: ${insights.testValues.map(t => `${t.name}: ${t.value}`).join(', ')}`;
    }
    if (insights.medications.length > 0) {
      aiText += `\n• Prescribed Medicines: ${insights.medications.join(', ')}`;
    }
    aiText += `\n\n✅ Saved securely to your Records vault.`;

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiText,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
                  Stay hydrated and maintain balanced rest for optimal wellness today.
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
                      {Boolean(msg.text) && (
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
                      )}

                      {/* Render Attachment if present */}
                      {msg.attachment && (
                        <View style={[styles.attachmentCardContainer, isUser && { alignSelf: 'flex-end' }]}>
                          {msg.attachment.type === 'image' ? (
                            <View style={styles.attachedImgWrapper}>
                              <Image source={{ uri: msg.attachment.uri }} style={styles.attachedImg} resizeMode="cover" />
                              <View style={[styles.attachedImgFooter, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.85)' }]}>
                                <ImageIcon size={13} color="#10B981" />
                                <Text style={[styles.attachedImgName, { color: isDark ? '#E2E8F0' : '#1E293B' }]} numberOfLines={1}>
                                  {msg.attachment.name}
                                </Text>
                              </View>
                            </View>
                          ) : (
                            <View
                              style={[
                                styles.attachedDocCard,
                                {
                                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#EFFFFA',
                                  borderColor: isDark ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.25)',
                                },
                              ]}
                            >
                              <View style={styles.attachedDocIconCircle}>
                                <FileText size={20} color="#10B981" />
                              </View>
                              <View style={styles.attachedDocTextCol}>
                                <Text style={[styles.attachedDocTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]} numberOfLines={1}>
                                  {msg.attachment.name}
                                </Text>
                                <Text style={[styles.attachedDocSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                                  {msg.attachment.category || 'Medical Record'} • Saved to Records
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
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
                {/* Item 1: Photos */}
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

  /* ── Attachment Styling ────────────────────────────────────────── */
  attachmentCardContainer: {
    marginTop: 8,
    maxWidth: SCREEN_WIDTH * 0.78,
  },
  attachedImgWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  attachedImg: {
    width: '100%',
    height: 150,
    backgroundColor: '#111',
  },
  attachedImgFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  attachedImgName: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  attachedDocCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  attachedDocIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(16,185,129,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachedDocTextCol: {
    flex: 1,
  },
  attachedDocTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  attachedDocSub: {
    fontSize: 11.5,
    fontWeight: '500',
    marginTop: 2,
  },
});

