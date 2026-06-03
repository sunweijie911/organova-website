import { PageHero } from '@/components/PageHero';

export default function HeroSection() {
  return (
    <PageHero
      align="bottom"
      bgSrc="/assets/images/tumor-types/hero-bg.png"
      subtitle="1,500+ deeply characterized patient-derived organoid models. 20+ cancer types. Both PDO 1.0 and Organoid 2.0 (ALI-PDO™) formats available."
      title="The World's Largest Living Cancer Biobank."
      titleGap={77}
    />
  );
}
