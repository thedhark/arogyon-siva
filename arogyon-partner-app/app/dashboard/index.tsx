import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PartnerHeader } from '../../components/PartnerHeader';
import { AnalyticsOverviewCard } from '../../components/AnalyticsOverviewCard';
import { PostPublisherCard } from '../../components/PostPublisherCard';
import { LeadRequestCard } from '../../components/LeadRequestCard';
import { usePartnerStore } from '../../hooks/usePartnerStore';
import { useTheme } from '../../hooks/useTheme';

export default function PartnerDashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { leads, posts, boostTiers, activeBoostId } = usePartnerStore();

  const activeBoost = boostTiers.find((b) => b.id === activeBoostId);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <PartnerHeader />

      {/* Quick Nav Bar */}
      <View style={[styles.navBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="grid-sharp" size={16} color="#3B82F6" />
          <Text style={[styles.navText, { color: '#3B82F6' }]}>Dashboard</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/content' as any)} style={styles.navItem}>
          <Ionicons name="newspaper-outline" size={16} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Content</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/boost' as any)} style={styles.navItem}>
          <Ionicons name="flash-outline" size={16} color="#EC4899" />
          <Text style={[styles.navText, { color: colors.text }]}>Boost</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/leads' as any)} style={styles.navItem}>
          <Ionicons name="people-outline" size={16} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Leads</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/listings' as any)} style={styles.navItem}>
          <Ionicons name="pricetags-outline" size={16} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Listings</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/profile' as any)} style={styles.navItem}>
          <Ionicons name="person-outline" size={16} color={colors.text} />
          <Text style={[styles.navText, { color: colors.text }]}>Profile</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Active Boost Banner */}
        {activeBoost && (
          <Pressable
            onPress={() => router.push('/boost' as any)}
            style={({ pressed }) => [
              styles.boostBanner,
              { backgroundColor: 'rgba(236, 72, 153, 0.15)', borderColor: '#EC4899', opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={styles.boostBannerLeft}>
              <View style={styles.boostIconBox}>
                <Ionicons name="rocket-sharp" size={20} color="#EC4899" />
              </View>
              <View>
                <Text style={styles.boostTitle}>{activeBoost.title} Active</Text>
                <Text style={styles.boostSub}>{activeBoost.estimatedReach} • High Conversion Rate</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#EC4899" />
          </Pressable>
        )}

        {/* Analytics Section */}
        <AnalyticsOverviewCard />

        {/* Post Publisher Widget */}
        <PostPublisherCard />

        {/* Recent Patient Leads Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Incoming Patient Enquiries ({leads.length})</Text>
          <Pressable onPress={() => router.push('/leads' as any)}>
            <Text style={styles.viewAllText}>View All Leads</Text>
          </Pressable>
        </View>

        {leads.slice(0, 2).map((lead) => (
          <LeadRequestCard key={lead.id} lead={lead} />
        ))}

        {/* Recent Content Published */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Hospital Announcements</Text>
          <Pressable onPress={() => router.push('/content' as any)}>
            <Text style={styles.viewAllText}>Manage Feed</Text>
          </Pressable>
        </View>

        {posts.map((post) => (
          <View
            key={post.id}
            style={[styles.postPreviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={styles.postPreviewHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{post.category}</Text>
              </View>
              <Text style={styles.postTime}>{post.createdAt}</Text>
            </View>
            <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
            <Text style={styles.postSnippet} numberOfLines={2}>
              {post.content}
            </Text>

            <View style={styles.postMetricsRow}>
              <View style={styles.metricItem}>
                <Ionicons name="eye-outline" size={14} color="#94A3B8" />
                <Text style={styles.metricText}>{post.viewsCount} Views</Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="heart-outline" size={14} color="#EF4444" />
                <Text style={styles.metricText}>{post.likesCount} Likes</Text>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  activeNavItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  boostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  boostBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boostIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boostTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#EC4899',
  },
  boostSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  viewAllText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '700',
  },
  postPreviewCard: {
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
  },
  postPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
  },
  postTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  postSnippet: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
  },
  postMetricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
