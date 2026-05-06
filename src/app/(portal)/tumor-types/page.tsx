import type { Metadata } from 'next';
import TumorTypesListView from './list';

export const metadata: Metadata = {
  title: 'Tumor Types',
  description:
    "Browse Organova's cancer type library covering 30+ tumor types — including lung, colorectal, breast, liver, and rare cancers — with validated PDO models.",
};

export default TumorTypesListView;
