import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Platform, Modal, Animated as RNAnimated, KeyboardAvoidingView, Image } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue, interpolate, Extrapolation, useSharedValue, withTiming, useAnimatedScrollHandler, useAnimatedReaction, scrollTo, useAnimatedRef } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';
import { Sparkles, Activity, FileText, Stethoscope, ChevronDown, Search, BookOpen, Clock, Menu, Plus, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Svg, { Defs, LinearGradient, Stop, Mask, Rect, Path, Circle } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import ChatInputBar from './ChatInputBar';
import { ChatSuggestionCarousel } from './ChatSuggestionCarousel';

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

const generateAiResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return "Hello! I'm Arogyon AI, your personal health assistant. I can help you find specialists, track health plans, book clinic visits, or explain medical packages. What's on your mind today?";
  }
  if (q.includes('pain') || q.includes('fever') || q.includes('cough') || q.includes('headache') || q.includes('stomach') || q.includes('hurt')) {
    return "I'm sorry to hear that you are feeling unwell. For symptoms of discomfort or pain, it's best to consult a clinical expert. Would you like me to guide you to book an In-Clinic Specialist or a General Physician visit at Apollo Hospitals?";
  }
  if (q.includes('book') || q.includes('doctor') || q.includes('clinic') || q.includes('appointment') || q.includes('specialist') || q.includes('physician')) {
    return "I can help you find top-rated specialists for in-clinic visits! You can search for doctors by tapping on the Services row on the home page or browsing through the 'Care' tab. Would you like to check out general physicians or physiotherapists?";
  }
  if (q.includes('diet') || q.includes('nutrition') || q.includes('weight') || q.includes('eating') || q.includes('food')) {
    return "A tailored diet is essential for optimal health! We have custom Ayurvedic Diet & Lifestyle plans managed 1-on-1 by certified nutritionists. You can subscribe to these diet packages under the 'Plans' tab.";
  }
  if (q.includes('gym') || q.includes('yoga') || q.includes('fitness') || q.includes('exercise') || q.includes('workout')) {
    return "Physical activity keeps the body strong and minds clear! We partner with top centers to offer premium Gym & Yoga plans. You can view them by going to 'Wellness' from the quick actions or checking the Fitness category.";
  }
  if (q.includes('lab') || q.includes('test') || q.includes('blood') || q.includes('report') || q.includes('diagnostic')) {
    return "We offer convenient at-home sample collection for diagnostic lab tests. You can book individual tests or comprehensive health checkups directly from the home page. Let me know if you'd like me to guide you there!";
  }
  return "That sounds like an important health query. To give you the safest and most accurate guidance, would you like me to help you navigate to book an in-person clinical consultation with one of our verified specialists?";
};


function TypingIndicator() {
  const { colors, isDark } = useTheme();
  const [dot1] = useState(new RNAnimated.Value(0.4));
  const [dot2] = useState(new RNAnimated.Value(0.4));
  const [dot3] = useState(new RNAnimated.Value(0.4));

  useEffect(() => {
    const animateDot = (val: any, delay: number) => {
      return RNAnimated.sequence([
        RNAnimated.delay(delay),
        RNAnimated.loop(
          RNAnimated.sequence([
            RNAnimated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
            RNAnimated.timing(val, { toValue: 0.4, duration: 400, useNativeDriver: true }),
          ])
        ),
      ]);
    };
    const animation = RNAnimated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 150),
      animateDot(dot3, 300),
    ]);
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={[
      styles.messageBubble, 
      styles.aiBubble, 
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', 
        borderColor: isDark ? '#333' : '#F3F4F6', 
        flexDirection: 'row', 
        gap: 6, 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 12 
      }
    ]}>
      <RNAnimated.View style={[styles.typingDot, { opacity: dot1 }]} />
      <RNAnimated.View style={[styles.typingDot, { opacity: dot2 }]} />
      <RNAnimated.View style={[styles.typingDot, { opacity: dot3 }]} />
    </View>
  );
}

export default function GlobalChatOverlay({ chatModeProgress, onClose }: Props) {
  const { colors, isDark } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const sidebarProgress = useSharedValue(0);
  const chatStartedProgress = useSharedValue(0);

  const carouselContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(chatStartedProgress.value, [0, 1], [1, 0.75], Extrapolation.CLAMP);
    const opacity = interpolate(chatStartedProgress.value, [0, 1], [1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(chatStartedProgress.value, [0, 1], [0, -200], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }, { scale }],
      pointerEvents: chatStartedProgress.value > 0.5 ? 'none' : 'auto',
    };
  });

  const chatMessagesContainerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(chatStartedProgress.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(chatStartedProgress.value, [0, 1], [120, 0], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
      pointerEvents: chatStartedProgress.value < 0.2 ? 'none' : 'auto',
    };
  });

  useEffect(() => {
    if (messages.length === 0) {
      chatStartedProgress.value = withTiming(0, { duration: 300 });
    } else {
      chatStartedProgress.value = withTiming(1, { duration: 400 });
    }
  }, [messages]);



  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), text: text.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAiResponse(text);
      setMessages(prev => [...prev, { id: Date.now().toString(), text: reply, sender: 'ai' }]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

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
    handleSendMessage(text);
  };

  return (
    <>
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <ChevronDown size={28} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chat Area */}
            {/* Chat Area */}
            <View style={styles.chatAreaContainer}>
              {/* Banner and Suggestions snappable carousel */}
              <Animated.View style={carouselContainerStyle}>
                <ChatSuggestionCarousel 
                  chatModeProgress={chatModeProgress} 
                  onSuggestionPress={handleSuggestionPress} 
                />
              </Animated.View>

              {/* Chat messages viewport */}
              <Animated.View style={[styles.chatViewport, chatMessagesContainerStyle]}>
                <ScrollView 
                  ref={scrollViewRef} 
                  style={styles.chatArea} 
                  contentContainerStyle={styles.chatContent} 
                  showsVerticalScrollIndicator={false}
                >
                  {messages.map((msg, index) => (
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
                  ))}
                  {isTyping && (
                    <View style={[styles.messageRow, { justifyContent: 'flex-start' }]}>
                      <AiAvatar />
                      <TypingIndicator />
                    </View>
                  )}
                </ScrollView>
              </Animated.View>
            </View>

            {/* Bottom Fog/Smoke Gradient (Removed per user request for clean white) */}

            {/* Chat Input Bar */}
            <View style={{ zIndex: 2 }}>
              <ChatInputBar onSendMessage={handleSendMessage} />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
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
    left: 0, // counteract wrapper padding
    right: 0,
    height: height + 150, // Full screen height
    zIndex: 900, // Below the morphing logo, but above everything else
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 160, // space for tab bar morph offset
    paddingHorizontal: 12,
  },
  chatFogBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 160,
    zIndex: 1,
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
  widgetsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
  },
  chatAreaContainer: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
  },

  chatViewport: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
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
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  }
});
