import HeroBanner from './hero-banner';
import KeyMetrics from './key-metrics';
import SolutionCards from './solution-cards';
import TrustedPartners from './trusted-partners';
import WhatWeDo from './what-we-do';

export default function HomeView() {
  return (
    <>
      <HeroBanner />
      <WhatWeDo />
      <KeyMetrics />
      <SolutionCards />
      <TrustedPartners />
    </>
  );
}
