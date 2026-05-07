import { PageHero } from '@/components/PageHero';

export default function HeroBanner() {
  return (
    <PageHero
      bgSrc="/assets/images/biotech-partnerships/hero-bg-ad2606.png"
      subtitle="For biotech companies that need more than a CRO—a scientific partner who understands your biology and shares your ambition."
      title={`We Don't Just Run Your Assay. \nWe Build Your Science.`}
      titleMaxWidth={1098}
    />
  );
}
