import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Send,
  Headphones,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Fonts } from '@/constants/theme';
import { useProfileStore } from '@/hooks/useProfileStore';
import { useBookingStore } from '@/hooks/useBookingStore';

interface SupportOption {
  id: string;
  label: string;
  response: string;
  actionLabel?: string;
  actionType?: 'reschedule' | 'refund' | 'call' | 'agent';
}

interface Message {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  time: string;
  options?: SupportOption[];
  actionLabel?: string;
  actionType?: string;
  isReschedulePrompt?: boolean;
  rescheduleSuccessInfo?: {
    date: string;
    time: string;
    doctorName: string;
    hospitalName: string;
  };
}

interface ArogyonSupportModalProps {
  visible: boolean;
  onClose: () => void;
  bookingInfo?: {
    id: string;
    hospitalName?: string;
    doctorName?: string;
    speciality?: string;
    patientName?: string;
  };
}

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    id: '1',
    label: 'I have slot timing or rescheduling issue with my booking',
    response: 'We understand schedule changes happen! You can pick a new date and time slot below to reschedule your visit instantly.',
    actionLabel: 'Select New Slot',
    actionType: 'reschedule',
  },
  {
    id: '2',
    label: 'Doctor was unavailable or delayed at clinic',
    response: 'We sincerely apologize for the delay. We are checking in real-time with the hospital care desk to prioritize your token or arrange immediate consult.',
    actionLabel: 'Call Hospital Desk',
    actionType: 'call',
  },
  {
    id: '3',
    label: 'I need help with my digital prescription & lab tests',
    response: 'Digital prescriptions are automatically uploaded to your Arogyon Records vault within 30 minutes of consultation completion.',
    actionLabel: 'Open Records Vault',
    actionType: 'agent',
  },
  {
    id: '4',
    label: 'Payment, refund or billing summary issue',
    response: 'All payments on Arogyon are 100% covered under Arogyon SafePay. If your visit was cancelled or overcharged, refunds are initiated instantly within 3-5 business days.',
    actionLabel: 'Check Refund Status',
    actionType: 'refund',
  },
  {
    id: '5',
    label: 'I have not received hospital confirmation',
    response: 'Hospital desks usually verify specialist availability within 10-15 minutes. We have sent an automated high-priority reminder to the clinic coordinator.',
    actionLabel: 'Send Reminder',
    actionType: 'agent',
  },
  {
    id: '6',
    label: 'Chat with Live Medical Support Agent',
    response: 'Connecting you with an Arogyon Senior Care Manager... Expected wait time is under 1 minute.',
    actionLabel: 'Connect Agent',
    actionType: 'agent',
  },
];

const RESCHEDULE_DATES = [
  { id: 'd1', day: 'Today', date: '26 Aug' },
  { id: 'd2', day: 'Tomorrow', date: '27 Aug' },
  { id: 'd3', day: 'Thu', date: '28 Aug' },
  { id: 'd4', day: 'Fri', date: '29 Aug' },
];

const RESCHEDULE_TIMES = [
  '09:30 AM',
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '04:30 PM',
  '06:00 PM',
];

export default function ArogyonSupportModal({
  visible,
  onClose,
  bookingInfo,
}: ArogyonSupportModalProps) {
  const { colors, isDark } = useTheme();
  const userProfile = useProfileStore((state) => state.userProfile);
  const rescheduleAppointment = useBookingStore((state) => state.rescheduleAppointment);
  const scrollViewRef = useRef<ScrollView>(null);

  const patientName = bookingInfo?.patientName || userProfile?.name || 'Kandala Sridhar';
  const hospitalName = bookingInfo?.hospitalName || 'Apollo Hospitals';
  const rawId = bookingInfo?.id || 'app-101';
  const bookingId = `#${rawId.replace(/[^0-9]/g, '') || '8506003545'}`;
  const doctorName = bookingInfo?.doctorName || 'Dr. Ramesh Verma';

  const getCurrentTimeStr = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLiveAgent, setIsLiveAgent] = useState(false);

  // Reschedule state
  const [selectedDate, setSelectedDate] = useState(RESCHEDULE_DATES[1]); // Default Tomorrow
  const [selectedTime, setSelectedTime] = useState(RESCHEDULE_TIMES[1]); // Default 10:00 AM
  const [isReschedulingActive, setIsReschedulingActive] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsReschedulingActive(false);
      setMessages([
        {
          id: 'm1',
          sender: 'bot',
          text: `Hi ${patientName.split(' ')[0]}!\nI'm here to help you with your booking for ${doctorName} at ${hospitalName} (${bookingId}).`,
          time: getCurrentTimeStr(),
        },
        {
          id: 'm2',
          sender: 'bot',
          text: 'How can we help you with your booking?',
          time: getCurrentTimeStr(),
          options: SUPPORT_OPTIONS,
        },
      ]);
    }
  }, [visible, bookingInfo]);

  const handleOptionPress = (option: SupportOption) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: option.label,
      time: getCurrentTimeStr(),
    };

    const isReschedule = option.actionType === 'reschedule' || option.id === '1';

    const botMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: option.actionType === 'agent' ? 'agent' : 'bot',
      text: option.response,
      time: getCurrentTimeStr(),
      actionLabel: option.actionLabel,
      actionType: option.actionType,
      isReschedulePrompt: isReschedule,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (isReschedule) {
      setIsReschedulingActive(true);
    }
    if (option.actionType === 'agent') {
      setIsLiveAgent(true);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleConfirmReschedule = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const formattedDate = `${selectedDate.day}, ${selectedDate.date}`;
    const formattedTime = selectedTime;

    // 1. Update central store
    rescheduleAppointment(rawId, formattedDate, formattedTime);

    setIsReschedulingActive(false);

    // 2. Add user request message
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: `Reschedule to ${formattedDate} at ${formattedTime}`,
      time: getCurrentTimeStr(),
    };

    // 3. Add bot success confirmation message
    const successMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'bot',
      text: `🎉 Reschedule Confirmed!\n\nYour visit with ${doctorName} at ${hospitalName} is successfully rescheduled for ${formattedDate} at ${formattedTime}.\n\nUpdated Booking ID: ${bookingId}\nA confirmation SMS & WhatsApp pass have been sent.`,
      time: getCurrentTimeStr(),
      rescheduleSuccessInfo: {
        date: formattedDate,
        time: formattedTime,
        doctorName,
        hospitalName,
      },
    };

    setMessages((prev) => [...prev, userMsg, successMsg]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const textToSend = inputText.trim();
    setInputText('');

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: 'user',
      text: textToSend,
      time: getCurrentTimeStr(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const botResponse: Message = {
        id: Math.random().toString(36).substring(7),
        sender: 'bot',
        text: `Thank you for sharing the details. Our hospital support liaison has noted: "${textToSend}". We are actively assisting with your booking (${bookingId}).`,
        time: getCurrentTimeStr(),
      };
      setMessages((prev) => [...prev, botResponse]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 600);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: isDark ? '#0B132B' : '#EDF4FC' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Floating Header */}
        <View
          style={[
            styles.headerFloating,
            {
              backgroundColor: isDark ? '#162038' : '#FFFFFF',
              borderColor: isDark ? '#233252' : '#E0ECF8',
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles.headerBackBtn}>
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Arogyon Support</Text>
              <View style={styles.onlineBadgeRow}>
                <View style={styles.greenDot} />
                <Text style={styles.onlineText}>
                  {isLiveAgent ? 'Live Care Specialist' : '24x7 Medical Assistant'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.endChatBtn}>
            <Text style={styles.endChatText}>End chat</Text>
          </TouchableOpacity>
        </View>

        {/* Live Support Banner */}
        <View
          style={[
            styles.supportBanner,
            {
              backgroundColor: isDark ? 'rgba(79, 70, 229, 0.12)' : '#EEF2FF',
              borderColor: isDark ? 'rgba(79, 70, 229, 0.3)' : '#C7D2FE',
            },
          ]}
        >
          <Headphones size={15} color="#4F46E5" style={{ marginRight: 6 }} />
          <Text style={styles.bannerText}>
            Booking Reference: <Text style={styles.bannerBold}>{bookingId}</Text> • Instant Resolution
          </Text>
        </View>

        {/* Messages Feed */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.todayStamp}>
            <Text style={styles.todayStampText}>Today</Text>
          </View>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  isUser ? styles.userMsgWrapper : styles.botMsgWrapper,
                ]}
              >
                {/* Message Bubble */}
                <View
                  style={[
                    styles.bubble,
                    isUser
                      ? styles.userBubble
                      : [
                          styles.botBubble,
                          {
                            backgroundColor: isDark ? '#1F2430' : '#FFFFFF',
                            borderColor: isDark ? '#2E384D' : '#E2E8F0',
                          },
                        ],
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isUser ? styles.userBubbleText : { color: colors.text },
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.timestampText,
                      isUser ? styles.userTimestamp : { color: '#94A3B8' },
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>

                {/* Reschedule Success Summary Card */}
                {msg.rescheduleSuccessInfo && (
                  <View
                    style={[
                      styles.rescheduleSuccessCard,
                      {
                        backgroundColor: isDark ? '#064E3B20' : '#ECFDF5',
                        borderColor: isDark ? '#059669' : '#A7F3D0',
                      },
                    ]}
                  >
                    <View style={styles.rescheduleSuccessHeader}>
                      <CheckCircle2 size={18} color="#10B981" />
                      <Text style={styles.rescheduleSuccessTitle}>Slot Updated & Confirmed</Text>
                    </View>
                    <View style={styles.rescheduleSuccessMeta}>
                      <View style={styles.rescheduleMetaRow}>
                        <Calendar size={14} color="#10B981" />
                        <Text style={styles.rescheduleMetaText}>
                          {msg.rescheduleSuccessInfo.date}
                        </Text>
                      </View>
                      <View style={styles.rescheduleMetaRow}>
                        <Clock size={14} color="#10B981" />
                        <Text style={styles.rescheduleMetaText}>
                          {msg.rescheduleSuccessInfo.time}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.doneCloseBtn}
                      onPress={onClose}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.doneCloseBtnText}>Done • View Order Details</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Minimal End-to-End Reschedule Slot Selector Card */}
                {msg.isReschedulePrompt && isReschedulingActive && (
                  <View
                    style={[
                      styles.reschedulePickerCard,
                      {
                        backgroundColor: isDark ? '#181A20' : '#FFFFFF',
                        borderColor: isDark ? '#2D3139' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.pickerHeader}>
                      <Sparkles size={16} color="#E11D48" />
                      <Text style={[styles.pickerTitle, { color: colors.text }]}>
                        Select New Date & Time Slot
                      </Text>
                    </View>

                    {/* 1. Date Selector Pills */}
                    <Text style={styles.pickerSubheading}>Choose Date</Text>
                    <View style={styles.dateChipsGrid}>
                      {RESCHEDULE_DATES.map((item) => {
                        const isSelected = selectedDate.id === item.id;
                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.dateChip,
                              isSelected
                                ? styles.dateChipSelected
                                : [
                                    styles.dateChipUnselected,
                                    {
                                      backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                      borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                    },
                                  ],
                            ]}
                            onPress={() => {
                              if (Platform.OS !== 'web') {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }
                              setSelectedDate(item);
                            }}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                styles.dateDayText,
                                isSelected ? styles.textWhite : { color: '#64748B' },
                              ]}
                            >
                              {item.day}
                            </Text>
                            <Text
                              style={[
                                styles.dateNumText,
                                isSelected ? styles.textWhite : { color: colors.text },
                              ]}
                            >
                              {item.date}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* 2. Time Slots Grid */}
                    <Text style={styles.pickerSubheading}>Available Slots</Text>
                    <View style={styles.timeChipsGrid}>
                      {RESCHEDULE_TIMES.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <TouchableOpacity
                            key={slot}
                            style={[
                              styles.timeChip,
                              isSelected
                                ? styles.timeChipSelected
                                : [
                                    styles.timeChipUnselected,
                                    {
                                      backgroundColor: isDark ? '#27272A' : '#F8FAFC',
                                      borderColor: isDark ? '#3F3F46' : '#E2E8F0',
                                    },
                                  ],
                            ]}
                            onPress={() => {
                              if (Platform.OS !== 'web') {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }
                              setSelectedTime(slot);
                            }}
                            activeOpacity={0.75}
                          >
                            <Text
                              style={[
                                styles.timeChipText,
                                isSelected ? styles.textWhite : { color: colors.text },
                              ]}
                            >
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* 3. Confirm Reschedule CTA */}
                    <TouchableOpacity
                      style={styles.confirmRescheduleBtn}
                      onPress={handleConfirmReschedule}
                      activeOpacity={0.85}
                    >
                      <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.confirmRescheduleBtnText}>
                        Confirm Reschedule ({selectedDate.day} • {selectedTime})
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Option Pill List (Matching Screenshot 3) */}
                {msg.options && (
                  <View
                    style={[
                      styles.optionsContainer,
                      {
                        backgroundColor: isDark ? '#181A20' : '#FFFFFF',
                        borderColor: isDark ? '#2D3139' : '#E2E8F0',
                      },
                    ]}
                  >
                    {msg.options.map((opt, idx) => (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.optionItem,
                          idx < (msg.options?.length || 0) - 1 && [
                            styles.optionBorderBottom,
                            { borderBottomColor: isDark ? '#2D3139' : '#F1F5F9' },
                          ],
                        ]}
                        onPress={() => handleOptionPress(opt)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.optionItemText}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Message Input */}
        <View
          style={[
            styles.bottomInputBar,
            {
              backgroundColor: isDark ? '#181A20' : '#FFFFFF',
              borderTopColor: isDark ? '#27272A' : '#E2E8F0',
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: isDark ? '#262833' : '#F1F5F9',
                color: colors.text,
              },
            ]}
            placeholder="Type your message..."
            placeholderTextColor={isDark ? '#71717A' : '#94A3B8'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? '#E11D48' : isDark ? '#3F3F46' : '#E2E8F0',
              },
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={18} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerFloating: {
    marginTop: Platform.OS === 'ios' ? 48 : 28,
    marginHorizontal: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
  },
  onlineText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: '#64748B',
  },
  endChatBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  endChatText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#E11D48',
    fontWeight: '700',
  },
  supportBanner: {
    marginHorizontal: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#4F46E5',
  },
  bannerBold: {
    fontFamily: Fonts.bold,
    fontWeight: '700',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  todayStamp: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 10,
  },
  todayStampText: {
    fontFamily: Fonts.medium,
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  messageWrapper: {
    marginBottom: 14,
    maxWidth: '94%',
  },
  botMsgWrapper: {
    alignSelf: 'flex-start',
  },
  userMsgWrapper: {
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },
  botBubble: {
    borderWidth: 1,
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#E11D48',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  optionsContainer: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  optionBorderBottom: {
    borderBottomWidth: 1,
  },
  optionItemText: {
    fontFamily: Fonts.semiBold,
    fontSize: 13.5,
    color: '#2563EB',
    fontWeight: '600',
    lineHeight: 18,
  },

  /* Reschedule Slot Picker Card Styles */
  reschedulePickerCard: {
    marginTop: 10,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pickerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    fontWeight: '700',
  },
  pickerSubheading: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dateChipsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  dateChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipSelected: {
    backgroundColor: '#E11D48',
  },
  dateChipUnselected: {
    borderWidth: 1,
  },
  dateDayText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
  },
  dateNumText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  timeChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timeChip: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipSelected: {
    backgroundColor: '#E11D48',
  },
  timeChipUnselected: {
    borderWidth: 1,
  },
  timeChipText: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    fontWeight: '700',
  },
  confirmRescheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
    height: 46,
    borderRadius: 14,
    gap: 8,
  },
  confirmRescheduleBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13.5,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* Reschedule Success Card */
  rescheduleSuccessCard: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  rescheduleSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rescheduleSuccessTitle: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#10B981',
    fontWeight: '700',
  },
  rescheduleSuccessMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  rescheduleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rescheduleMetaText: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    color: '#10B981',
    fontWeight: '700',
  },
  doneCloseBtn: {
    backgroundColor: '#10B981',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneCloseBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  bottomInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
