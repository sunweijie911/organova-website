import { ArrowButton } from '@/components/ArrowButton';
import { PageHero } from '@/components/PageHero';

export default function PharmaSolutionsHero() {
  return (
    <PageHero
      bgSrc="/assets/images/pharma-solutions/hero-bg.png"
      subtitle="Preclinical success on artificial models isn't success—it's a delayed failure. We provide the biological truth needed to make confident go/no-go decisions."
      subtitleGap={114}
      title="Your Drug Works. Your Model Is Lying."
      titleGap={152}
    >
      <ArrowButton href="/contact" variant="dark">
        Discuss Your Program
      </ArrowButton>
    </PageHero>
  );
}
