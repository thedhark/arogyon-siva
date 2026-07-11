import {
  courses,
  doctors,
  hospitals,
  SERVICE_CATEGORIES,
  services,
} from '@/constants/health';

export type DiscoveryIntent =
  | 'all'
  | 'doctors'
  | 'hospitals'
  | 'services'
  | 'learning'
  | 'specialties';

export type DiscoveryEntityType =
  | 'doctor'
  | 'hospital'
  | 'service'
  | 'course'
  | 'specialty';

export interface DiscoveryRoute {
  pathname: string;
  params?: Record<string, string>;
}

export interface DiscoverySearchItem {
  id: string;
  type: DiscoveryEntityType;
  title: string;
  subtitle: string;
  meta: string;
  image?: string;
  accent: string;
  icon: string;
  intent: Exclude<DiscoveryIntent, 'all'>;
  score: number;
  route: DiscoveryRoute;
  keywords: string[];
}

export interface DiscoveryInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface DiscoverySearchModel {
  query: string;
  activeIntent: DiscoveryIntent;
  totalResults: number;
  headline: string;
  featuredInsights: DiscoveryInsight[];
  quickTerms: string[];
  resultBuckets: Array<{
    key: DiscoveryIntent;
    label: string;
    count: number;
  }>;
  results: DiscoverySearchItem[];
}

const intentLabels: Record<DiscoveryIntent, string> = {
  all: 'Everything',
  doctors: 'Doctors',
  hospitals: 'Hospitals',
  services: 'Services',
  learning: 'Learning',
  specialties: 'Specialties',
};

const searchableItems: DiscoverySearchItem[] = [
  ...doctors.map((doctor) => ({
    id: doctor.id,
    type: 'doctor' as const,
    title: doctor.name,
    subtitle: `${doctor.title} at ${doctor.hospital}`,
    meta: `${doctor.area} | ${doctor.wait} wait | ${doctor.fee}`,
    image: doctor.image,
    accent: '#0878d9',
    icon: 'Stethoscope',
    intent: 'doctors' as const,
    score: 72,
    route: {
      pathname: '/doctor-detail',
      params: { id: doctor.id },
    },
    keywords: [
      doctor.name,
      doctor.title,
      doctor.hospital,
      doctor.area,
      doctor.tag,
      'expert',
      'consultation',
    ],
  })),
  ...hospitals.map((hospital) => ({
    id: hospital.id,
    type: 'hospital' as const,
    title: hospital.name,
    subtitle: hospital.promise,
    meta: `${hospital.area} | ${hospital.time} | ${hospital.departments}`,
    image: hospital.image,
    accent: '#12b886',
    icon: 'Building2',
    intent: 'hospitals' as const,
    score: hospital.isEmergency ? 76 : 68,
    route: {
      pathname: '/service-detail',
      params: {
        id: hospital.id,
        name: hospital.name,
        image: hospital.image,
        detail: hospital.promise,
        promise: hospital.nextSlot,
        price: 'INR 1,200',
      },
    },
    keywords: [
      hospital.name,
      hospital.area,
      hospital.promise,
      hospital.departments,
      hospital.time,
      'facility',
      'care center',
    ],
  })),
  ...services.map((service) => ({
    id: service.id,
    type: 'service' as const,
    title: service.name,
    subtitle: service.detail,
    meta: `${service.category} | ${service.promise} | ${service.price}`,
    image: service.image,
    accent: '#ff7a59',
    icon: 'Sparkles',
    intent: 'services' as const,
    score: 66,
    route: {
      pathname: '/service-detail',
      params: {
        id: service.id,
        name: service.name,
        image: service.image,
        detail: service.detail,
        promise: service.promise,
        price: service.price,
      },
    },
    keywords: [
      service.name,
      service.detail,
      service.category,
      service.promise,
      'care',
      'support',
    ],
  })),
  ...courses.map((course) => ({
    id: course.id,
    type: 'course' as const,
    title: course.name,
    subtitle: `${course.mode} program with ${course.mentor}`,
    meta: `${course.duration} | ${course.sessions} | ${course.price}`,
    image: course.image,
    accent: '#7c4dff',
    icon: 'GraduationCap',
    intent: 'learning' as const,
    score: course.isRecommended ? 70 : 62,
    route: {
      pathname: '/course-detail',
      params: {
        id: course.id,
        name: course.name,
        image: course.image,
        mentor: course.mentor,
        mode: course.mode,
        duration: course.duration,
        sessions: course.sessions,
        price: course.price,
      },
    },
    keywords: [
      course.name,
      course.mentor,
      course.mode,
      course.duration,
      course.sessions,
      'program',
      'course',
      'learning',
    ],
  })),
  ...SERVICE_CATEGORIES.map((category) => ({
    id: category.id,
    type: 'specialty' as const,
    title: category.name,
    subtitle: 'Explore focused care pathways and specialist networks.',
    meta: 'Discovery lane | Fast access | Curated pathways',
    image: category.image,
    accent: '#0ea5a4',
    icon: category.icon,
    intent: 'specialties' as const,
    score: category.id === 'clinical' ? 74 : 60,
    route: {
      pathname: '/service-detail',
      params: {
        id: category.id,
        name: category.name,
        image: category.image,
        detail: 'Focused care pathways tailored to this specialty cluster.',
        promise: 'Expert discovery lane',
        price: 'INR 900',
      },
    },
    keywords: [category.name, category.id, 'specialty', 'discovery', 'category'],
  })),
];

const featuredInsights: DiscoveryInsight[] = [
  {
    id: 'nearby',
    title: 'Nearby first',
    description: 'Results prioritize fast access, strong ratings, and immediate routes.',
    icon: 'MapPin',
    accent: '#0878d9',
  },
  {
    id: 'trusted',
    title: 'Trusted signals',
    description: 'Verified experts, active hospitals, and curated care programs surface first.',
    icon: 'ShieldCheck',
    accent: '#12b886',
  },
  {
    id: 'learning',
    title: 'Learning lanes',
    description: 'Courses and specialty lanes sit beside care results for deeper discovery.',
    icon: 'BrainCircuit',
    accent: '#7c4dff',
  },
];

const quickTerms = ['cardio', 'urgent', 'diagnostics', 'home care', 'ayurveda', 'nutrition'];

const normalize = (value: string) => value.trim().toLowerCase();

const scoreItem = (item: DiscoverySearchItem, query: string) => {
  const q = normalize(query);
  if (!q) return item.score;

  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle);
  const meta = normalize(item.meta);
  const keywordBlob = item.keywords.map(normalize).join(' ');

  let score = item.score;
  if (title.includes(q)) score += 28;
  if (subtitle.includes(q)) score += 16;
  if (meta.includes(q)) score += 12;
  if (keywordBlob.includes(q)) score += 18;

  if (q.split(' ').every((part) => keywordBlob.includes(part))) {
    score += 10;
  }

  return score;
};

export function buildDiscoverySearchModel(
  query: string,
  activeIntent: DiscoveryIntent
): DiscoverySearchModel {
  const trimmedQuery = query.trim();
  const filtered = searchableItems
    .filter((item) => activeIntent === 'all' || item.intent === activeIntent)
    .filter((item) => !trimmedQuery || scoreItem(item, trimmedQuery) >= item.score + 10)
    .map((item) => ({
      ...item,
      score: scoreItem(item, trimmedQuery),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const resultBuckets = (Object.keys(intentLabels) as DiscoveryIntent[]).map((key) => ({
    key,
    label: intentLabels[key],
    count:
      key === 'all'
        ? searchableItems.length
        : searchableItems.filter((item) => item.intent === key).length,
  }));

  const headline = trimmedQuery
    ? `Showing the strongest matches for "${trimmedQuery}".`
    : activeIntent === 'all'
      ? 'A cleaner discovery canvas built around search, signals, and quick action.'
      : `${intentLabels[activeIntent]} arranged around the strongest discovery signals.`;

  return {
    query,
    activeIntent,
    totalResults: filtered.length,
    headline,
    featuredInsights,
    quickTerms,
    resultBuckets,
    results: filtered,
  };
}
