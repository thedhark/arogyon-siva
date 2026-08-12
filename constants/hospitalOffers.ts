export interface HospitalOffer {
  id: string;
  title: string;
  code: string;
  subtext: string;
  minAmount?: number;
  maxDiscount?: number;
  isGoldExclusive?: boolean;
  terms?: string[];
}

export const DEFAULT_HOSPITAL_OFFERS: HospitalOffer[] = [
  {
    id: 'offer-1',
    title: 'Flat ₹140 OFF above ₹199',
    code: 'HELLOEAT',
    subtext: 'Use code HELLOEAT',
    minAmount: 199,
    maxDiscount: 140,
    terms: ['Valid on all health checkups & OPD consults', 'Cannot be combined with other codes'],
  },
  {
    id: 'offer-2',
    title: '30% OFF up to ₹75 above ₹49',
    code: 'FOOD30',
    subtext: 'Use code FOOD30',
    minAmount: 49,
    maxDiscount: 75,
    terms: ['Applicable on first lab booking & consultations', 'Max discount capped at ₹75'],
  },
  {
    id: 'offer-3',
    title: '60% OFF up to ₹120 above ₹159',
    code: 'TASTY',
    subtext: 'Use code TASTY',
    minAmount: 159,
    maxDiscount: 120,
    terms: ['Valid on select specialist packages', 'Available once per user profile'],
  },
  {
    id: 'offer-4',
    title: 'Flat ₹150 OFF above ₹349',
    code: 'GET150',
    subtext: 'Use code GET150',
    minAmount: 349,
    maxDiscount: 150,
    terms: ['Valid on full body wellness screenings', 'Instant checkout discount'],
  },
  {
    id: 'offer-5',
    title: 'Flat ₹175 OFF above ₹449',
    code: 'GET175',
    subtext: 'Use code GET175',
    minAmount: 449,
    maxDiscount: 175,
    terms: ['Valid on hospital doctor appointment slots', 'Valid until end of month'],
  },
];

export const GOLD_EXCLUSIVE_OFFER = {
  id: 'gold-1',
  title: 'Free delivery above ₹49',
  subtitle: 'join Gold to unlock',
  price: 'Add Gold - ₹1',
};
