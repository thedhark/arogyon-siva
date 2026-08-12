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

import CategoryMainCard from './CategoryMainCard';
import { CATEGORY_INDEX_REGISTRY } from '@/constants/package-data';

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
  CategoryMainCard,
};

export const ALL_CATEGORY_CARDS = Object.values(CATEGORY_INDEX_REGISTRY).map((cat) => ({
  id: cat.id,
  name: cat.title,
  category: cat,
  component: CategoryMainCard,
  keywords: [
    cat.id,
    cat.title,
    cat.subtitle,
    ...cat.aliases,
    ...cat.subcategories,
  ].map((k) => k.toLowerCase()),
}));
