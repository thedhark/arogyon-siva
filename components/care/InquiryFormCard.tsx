import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { 
  ChevronDown, 
  Lock, 
  ArrowRight, 
  Upload, 
  LucideIcon 
} from 'lucide-react-native';

export interface FormFieldConfig {
  key: string;
  type: 'dropdown' | 'text' | 'phone' | 'file';
  icon: LucideIcon;
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onPressDropdown?: () => void;
  // Phone field specifics
  countryCode?: string;
  countryFlag?: string;
  onPressCountry?: () => void;
  // File upload specifics
  subtext?: string;
  fileHint?: string;
  onFileUpload?: () => void;
  fileButtonText?: string;
}

interface InquiryFormCardProps {
  isDark: boolean;
  headerIcon: LucideIcon;
  headerIconBg?: string;
  headerIconColor?: string;
  title: string;
  subtitle: string;
  topRightBadge?: {
    text: string;
    icon?: LucideIcon;
    bg: string;
    color: string;
  };
  fields: FormFieldConfig[];
  submitButtonText: string;
  submitButtonBg?: string;
  submitButtonIcon?: LucideIcon;
  onSubmit: () => void;
  disclaimerText?: string;
  privacyLinkText?: string;
  onPrivacyPress?: () => void;
}

export default function InquiryFormCard({
  isDark,
  headerIcon: HeaderIcon,
  headerIconBg = '#E0F2FE',
  headerIconColor = '#0284C7',
  title,
  subtitle,
  topRightBadge,
  fields,
  submitButtonText,
  submitButtonBg = '#0B3848',
  submitButtonIcon: SubmitIcon = ArrowRight,
  onSubmit,
  disclaimerText = "By submitting, you agree to Arogyon's ",
  privacyLinkText = 'Privacy Policy',
  onPrivacyPress,
}: InquiryFormCardProps) {
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const cardBorder = isDark ? '#1F2937' : '#E2E8F0';
  const rowBg = isDark ? '#1A2332' : '#FAFCFD';
  const rowBorder = isDark ? '#263346' : '#EEF2F6';
  const iconCircleBg = isDark ? '#233044' : '#F0F4F8';
  const iconColor = isDark ? '#94A3B8' : '#64748B';
  const titleColor = isDark ? '#F8FAFC' : '#0F2936';
  const subtitleColor = isDark ? '#94A3B8' : '#5A7184';
  const labelColor = isDark ? '#E2E8F0' : '#0F2936';
  const placeholderColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <View style={[styles.cardContainer, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      {/* Form Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIconCircle, { backgroundColor: headerIconBg }]}>
            <HeaderIcon size={22} color={headerIconColor} />
          </View>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: titleColor }]}>{title}</Text>
            <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
          </View>
        </View>

        {topRightBadge && (
          <View style={[styles.topBadge, { backgroundColor: topRightBadge.bg }]}>
            {topRightBadge.icon && (
              <topRightBadge.icon size={12} color={topRightBadge.color} style={{ marginRight: 4 }} />
            )}
            <Text style={[styles.topBadgeText, { color: topRightBadge.color }]}>{topRightBadge.text}</Text>
          </View>
        )}
      </View>

      {/* Fields Stack */}
      <View style={styles.fieldsContainer}>
        {fields.map((field) => {
          const FieldIcon = field.icon;

          if (field.type === 'file') {
            return (
              <View
                key={field.key}
                style={[styles.fieldRow, styles.fileRow, { backgroundColor: rowBg, borderColor: rowBorder }]}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconCircleBg }]}>
                  <FieldIcon size={18} color={iconColor} />
                </View>
                <View style={styles.fieldContentLeft}>
                  <Text style={[styles.fieldLabel, { color: labelColor }]}>{field.label}</Text>
                  {field.subtext && (
                    <Text style={[styles.fileSubtext, { color: subtitleColor }]}>{field.subtext}</Text>
                  )}
                  {field.fileHint && (
                    <Text style={[styles.fileHint, { color: placeholderColor }]}>{field.fileHint}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: isDark ? '#243044' : '#F1F5F9' }]}
                  onPress={field.onFileUpload}
                  activeOpacity={0.8}
                >
                  <Upload size={13} color={isDark ? '#38BDF8' : '#0284C7'} />
                  <Text style={[styles.uploadBtnText, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    {field.fileButtonText || 'Upload Files'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }

          if (field.type === 'phone') {
            return (
              <View
                key={field.key}
                style={[styles.fieldRow, { backgroundColor: rowBg, borderColor: rowBorder }]}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconCircleBg }]}>
                  <FieldIcon size={18} color={iconColor} />
                </View>
                <View style={styles.fieldContentMiddle}>
                  <Text style={[styles.fieldLabel, { color: labelColor }]}>{field.label}</Text>
                  <View style={styles.phoneInputRow}>
                    <TouchableOpacity
                      style={styles.flagPicker}
                      onPress={field.onPressCountry}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.flagText}>{field.countryFlag || '🇮🇳'}</Text>
                      <Text style={[styles.countryCodeText, { color: titleColor }]}>
                        {field.countryCode || '+91'}
                      </Text>
                      <ChevronDown size={14} color={iconColor} />
                    </TouchableOpacity>
                    <View style={[styles.phoneDivider, { backgroundColor: isDark ? '#2D3748' : '#CBD5E1' }]} />
                    <TextInput
                      style={[styles.textInput, { color: titleColor }]}
                      placeholder={field.placeholder || 'Enter mobile number'}
                      placeholderTextColor={placeholderColor}
                      keyboardType="phone-pad"
                      value={field.value}
                      onChangeText={field.onChangeText}
                    />
                  </View>
                </View>
              </View>
            );
          }

          if (field.type === 'dropdown') {
            return (
              <TouchableOpacity
                key={field.key}
                style={[styles.fieldRow, { backgroundColor: rowBg, borderColor: rowBorder }]}
                onPress={field.onPressDropdown}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, { backgroundColor: iconCircleBg }]}>
                  <FieldIcon size={18} color={iconColor} />
                </View>
                <View style={styles.fieldContentMiddle}>
                  <Text style={[styles.fieldLabel, { color: labelColor }]}>{field.label}</Text>
                  <Text
                    style={[
                      styles.fieldValueText,
                      { color: field.value ? titleColor : placeholderColor },
                    ]}
                    numberOfLines={1}
                  >
                    {field.value || field.placeholder || 'Select option'}
                  </Text>
                </View>
                <ChevronDown size={18} color={iconColor} style={styles.rightChevron} />
              </TouchableOpacity>
            );
          }

          // Text Input fallback
          return (
            <View
              key={field.key}
              style={[styles.fieldRow, { backgroundColor: rowBg, borderColor: rowBorder }]}
            >
              <View style={[styles.iconCircle, { backgroundColor: iconCircleBg }]}>
                <FieldIcon size={18} color={iconColor} />
              </View>
              <View style={styles.fieldContentMiddle}>
                <Text style={[styles.fieldLabel, { color: labelColor }]}>{field.label}</Text>
                <TextInput
                  style={[styles.textInput, { color: titleColor }]}
                  placeholder={field.placeholder || 'Enter details'}
                  placeholderTextColor={placeholderColor}
                  value={field.value}
                  onChangeText={field.onChangeText}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: submitButtonBg }]}
        onPress={onSubmit}
        activeOpacity={0.9}
      >
        <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        <SubmitIcon size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      {/* Privacy Policy Footer */}
      <View style={styles.privacyRow}>
        <Lock size={12} color={isDark ? '#64748B' : '#94A3B8'} style={{ marginRight: 4 }} />
        <Text style={[styles.privacyText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
          {disclaimerText}
          <Text
            style={[styles.privacyLink, { color: isDark ? '#34D399' : '#059669' }]}
            onPress={onPrivacyPress}
          >
            {privacyLinkText}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
        shadowColor: '#000',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  headerIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  fieldsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 56,
  },
  fileRow: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldContentMiddle: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldContentLeft: {
    flex: 1,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  fieldValueText: {
    fontSize: 13,
    fontWeight: '500',
  },
  textInput: {
    fontSize: 13,
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  flagPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 6,
  },
  flagText: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  phoneDivider: {
    width: 1,
    height: 16,
    marginHorizontal: 8,
  },
  rightChevron: {
    marginLeft: 8,
  },
  fileSubtext: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  fileHint: {
    fontSize: 10,
    marginTop: 2,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'center',
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    width: '100%',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  privacyLink: {
    fontWeight: '700',
  },
});
