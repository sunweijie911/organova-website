import { PageHero } from '@/components/PageHero';

export default function ImmunoOncologyHero() {
  return (
    <PageHero
      bgSrc="/assets/images/immuno-oncology/hero-bg.png"
      subtitle={
        <>
          Testing an immunotherapy in a model without immune cells is not a
          preclinical study—it&apos;s a hypothesis with no data.
          <br />
          We provide the missing battlefield.
        </>
      }
      title={
        <>
          Your I-O Drug Needs an Immune System
          <br />
          to Fight.
        </>
      }
    />
  );
}
