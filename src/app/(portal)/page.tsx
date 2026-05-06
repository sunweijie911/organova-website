import type { Metadata } from 'next';
import HomeView from '@/views/portal/home';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Organova provides patient-derived organoid (PDO) models for oncology drug efficacy testing, immunotherapy, and translational research across 30+ tumor types.',
};

export default function HomePage() {
  return <HomeView />;
}
