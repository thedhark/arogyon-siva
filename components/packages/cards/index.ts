import PregnancyCareCard from './PregnancyCareCard';
import KneeCareCard from './KneeCareCard';
import DiabetesCareCard from './DiabetesCareCard';
import WeightCareCard from './WeightCareCard';
import CardiacCareCard from './CardiacCareCard';
import HerniaCareCard from './HerniaCareCard';
import SkinCareCard from './SkinCareCard';
import DentalCareCard from './DentalCareCard';
import OrthoCareCard from './OrthoCareCard';
import PediatricCareCard from './PediatricCareCard';
import SpineCareCard from './SpineCareCard';
import GastroCareCard from './GastroCareCard';
import EyeCareCard from './EyeCareCard';
import MentalCareCard from './MentalCareCard';
import OncologyCareCard from './OncologyCareCard';
import SeniorCareCard from './SeniorCareCard';
import WomensCareCard from './WomensCareCard';
import UrologyCareCard from './UrologyCareCard';
import ThyroidCareCard from './ThyroidCareCard';

export {
  PregnancyCareCard,
  KneeCareCard,
  DiabetesCareCard,
  WeightCareCard,
  CardiacCareCard,
  HerniaCareCard,
  SkinCareCard,
  DentalCareCard,
  OrthoCareCard,
  PediatricCareCard,
  SpineCareCard,
  GastroCareCard,
  EyeCareCard,
  MentalCareCard,
  OncologyCareCard,
  SeniorCareCard,
  WomensCareCard,
  UrologyCareCard,
  ThyroidCareCard,
};

export const ALL_CATEGORY_CARDS = [
  { id: 'pregnancy', name: 'Pregnancy Care Plan', component: PregnancyCareCard, keywords: ['pregnancy', 'maternity', 'baby', 'mother'] },
  { id: 'knee', name: 'Knee Recovery Plan', component: KneeCareCard, keywords: ['knee', 'joint', 'ortho', 'leg', 'recovery'] },
  { id: 'diabetes', name: 'Diabetes Management Plan', component: DiabetesCareCard, keywords: ['diabetes', 'sugar', 'blood sugar', 'glucose'] },
  { id: 'weight', name: 'Weight Loss Plan', component: WeightCareCard, keywords: ['weight', 'fat', 'obesity', 'diet', 'fitness'] },
  { id: 'cardiac', name: 'Cardiac & Heart Care Plan', component: CardiacCareCard, keywords: ['cardiac', 'heart', 'ecg', 'cardiology'] },
  { id: 'hernia', name: 'Hernia Surgery & Care Plan', component: HerniaCareCard, keywords: ['hernia', 'laparoscopy', 'surgery'] },
  { id: 'skin', name: 'Skin & Dermatology Care Plan', component: SkinCareCard, keywords: ['skin', 'derma', 'acne', 'glow'] },
  { id: 'dental', name: 'Dental & Smile Care Plan', component: DentalCareCard, keywords: ['dental', 'teeth', 'smile', 'tooth'] },
  { id: 'ortho', name: 'Orthopedic & Joint Care Plan', component: OrthoCareCard, keywords: ['ortho', 'bone', 'joint', 'fracture'] },
  { id: 'pediatrics', name: 'Pediatric & Child Care Plan', component: PediatricCareCard, keywords: ['pediatric', 'child', 'kids', 'baby', 'vaccine'] },
  { id: 'spine', name: 'Spine & Back Care Plan', component: SpineCareCard, keywords: ['spine', 'back', 'disc', 'neck'] },
  { id: 'gastro', name: 'Gastro & Digestive Health Plan', component: GastroCareCard, keywords: ['gastro', 'stomach', 'gut', 'digestive', 'liver'] },
  { id: 'eye', name: 'Eye & Vision Care Plan', component: EyeCareCard, keywords: ['eye', 'vision', 'lasik', 'cataract'] },
  { id: 'mental', name: 'Mental Wellness Plan', component: MentalCareCard, keywords: ['mental', 'mind', 'stress', 'therapy', 'sleep'] },
  { id: 'oncology', name: 'Cancer Screening & Care Plan', component: OncologyCareCard, keywords: ['cancer', 'oncology', 'screening', 'pet scan'] },
  { id: 'senior', name: 'Senior Citizen Health Plan', component: SeniorCareCard, keywords: ['senior', 'elderly', 'geriatric', 'old age'] },
  { id: 'womens', name: "Women's Wellness Plan", component: WomensCareCard, keywords: ['women', 'female', 'pcos', 'hormones'] },
  { id: 'urology', name: 'Kidney & Urology Care Plan', component: UrologyCareCard, keywords: ['kidney', 'urology', 'stone', 'urine'] },
  { id: 'thyroid', name: 'Thyroid & Hormonal Care Plan', component: ThyroidCareCard, keywords: ['thyroid', 't3', 't4', 'tsh', 'hormone'] },
];
