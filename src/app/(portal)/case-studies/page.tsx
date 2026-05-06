import type { Metadata } from 'next';
import CaseStudiesListView from '@/views/portal/case-studies/list';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Real-world examples of how Organova PDO models have been used to evaluate drug efficacy, identify resistance mechanisms, and guide clinical decisions.',
};

export default CaseStudiesListView;
