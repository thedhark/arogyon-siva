import { create } from 'zustand';
import {
  PartnerProfile,
  PartnerMetric,
  BoostTier,
  HospitalPost,
  PatientLead,
  PartnerPackageListing,
  MOCK_PARTNER_PROFILE,
  MOCK_PARTNER_METRICS,
  MOCK_BOOST_TIERS,
  MOCK_HOSPITAL_POSTS,
  MOCK_PATIENT_LEADS,
  MOCK_PARTNER_PACKAGES,
} from '../constants/partner-data';

interface PartnerStoreState {
  profile: PartnerProfile;
  metrics: PartnerMetric[];
  boostTiers: BoostTier[];
  activeBoostId: string | null;
  posts: HospitalPost[];
  leads: PatientLead[];
  packages: PartnerPackageListing[];

  // Actions
  activateBoost: (tierId: string) => void;
  addPost: (post: Omit<HospitalPost, 'id' | 'likesCount' | 'viewsCount' | 'createdAt' | 'published'>) => void;
  deletePost: (postId: string) => void;
  updateLeadStatus: (leadId: string, status: PatientLead['status']) => void;
  togglePackageActive: (packageId: string) => void;
  togglePackagePromote: (packageId: string) => void;
}

export const usePartnerStore = create<PartnerStoreState>((set) => ({
  profile: MOCK_PARTNER_PROFILE,
  metrics: MOCK_PARTNER_METRICS,
  boostTiers: MOCK_BOOST_TIERS,
  activeBoostId: 'boost-gold',
  posts: MOCK_HOSPITAL_POSTS,
  leads: MOCK_PATIENT_LEADS,
  packages: MOCK_PARTNER_PACKAGES,

  activateBoost: (tierId) =>
    set((state) => ({
      activeBoostId: tierId,
      profile: { ...state.profile, activeBoost: true },
    })),

  addPost: (newPostData) =>
    set((state) => {
      const newPost: HospitalPost = {
        id: `post-${Date.now()}`,
        ...newPostData,
        likesCount: 0,
        viewsCount: 1,
        createdAt: 'Just now',
        published: true,
      };
      return { posts: [newPost, ...state.posts] };
    }),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== postId),
    })),

  updateLeadStatus: (leadId, status) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
    })),

  togglePackageActive: (packageId) =>
    set((state) => ({
      packages: state.packages.map((pkg) =>
        pkg.id === packageId ? { ...pkg, active: !pkg.active } : pkg
      ),
    })),

  togglePackagePromote: (packageId) =>
    set((state) => ({
      packages: state.packages.map((pkg) =>
        pkg.id === packageId ? { ...pkg, promoted: !pkg.promoted } : pkg
      ),
    })),
}));
