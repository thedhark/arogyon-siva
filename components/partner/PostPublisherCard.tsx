import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export const PostPublisherCard: React.FC = () => {
  const { colors } = useTheme();
  const { addPost } = usePartnerStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Announcement' | 'Technology' | 'Camp' | 'Achievement'>('Announcement');
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Missing Fields', 'Please enter a title and post description.');
      return;
    }

    addPost({
      title: title.trim(),
      content: content.trim(),
      category,
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop',
    });

    setTitle('');
    setContent('');
    setIsExpanded(false);
    Alert.alert('Post Published!', 'Your hospital announcement is now live on the consumer feed.');
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Ionicons name="create" size={20} color="#3B82F6" />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Post Update or Health Story</Text>
        </View>
        <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.toggleBtn}>
          <Text style={styles.toggleText}>{isExpanded ? 'Collapse' : 'New Post'}</Text>
        </Pressable>
      </View>

      {isExpanded ? (
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            placeholder="Title (e.g. New Cardiac MRI Suite Installed)"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.text, borderColor: colors.border, backgroundColor: colors.background },
            ]}
            placeholder="Share hospital news, free checkup camp details, or technology updates..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.categoryRow}>
            {(['Announcement', 'Technology', 'Camp', 'Achievement'] as const).map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.catChip,
                  category === cat
                    ? { backgroundColor: '#3B82F6' }
                    : { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.catText, category === cat ? { color: '#FFFFFF' } : { color: colors.text }]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.photoUploadBtn}>
              <Ionicons name="image-outline" size={16} color="#3B82F6" />
              <Text style={styles.photoUploadText}>Attach Banner/Photo</Text>
            </Pressable>

            <Pressable style={styles.publishBtn} onPress={handlePublish}>
              <Ionicons name="send" size={14} color="#FFFFFF" />
              <Text style={styles.publishText}>Publish Now</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setIsExpanded(true)} style={styles.quickPrompt}>
          <Ionicons name="add-circle-outline" size={18} color="#94A3B8" />
          <Text style={styles.quickPromptText}>Tap to share an update, camp alert, or facility photo...</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
  },
  quickPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 8,
  },
  quickPromptText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  formContainer: {
    marginTop: 12,
    gap: 10,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  photoUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  photoUploadText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  publishText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
