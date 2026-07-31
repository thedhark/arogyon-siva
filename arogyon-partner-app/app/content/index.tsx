import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../components/PartnerHeader';
import { PostPublisherCard } from '../../components/PostPublisherCard';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export default function PartnerContentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { posts, deletePost } = usePartnerStore();

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete Post', `Are you sure you want to remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePost(id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      <View style={[styles.topHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.pageTitle, { color: colors.text }]}>Content & Post Manager</Text>
          <Text style={styles.pageSub}>Publish photos, announcements & checkup camps</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <PostPublisherCard />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Live Published Stories & Posts ({posts.length})</Text>

        {posts.map((post) => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.postHeader}>
              <View style={styles.catBadge}>
                <Text style={styles.catBadgeText}>{post.category}</Text>
              </View>

              <View style={styles.rightHeaderActions}>
                <Text style={styles.timeText}>{post.createdAt}</Text>
                <Pressable onPress={() => handleDelete(post.id, post.title)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </Pressable>
              </View>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>

            <View style={styles.footerRow}>
              <View style={styles.statGroup}>
                <Ionicons name="eye-outline" size={14} color="#3B82F6" />
                <Text style={styles.statText}>{post.viewsCount} Patient Views</Text>
              </View>

              <View style={styles.statGroup}>
                <Ionicons name="heart" size={14} color="#EF4444" />
                <Text style={styles.statText}>{post.likesCount} Likes</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleGroup: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pageSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  postCard: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  deleteBtn: {
    padding: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  content: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
