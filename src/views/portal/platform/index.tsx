import Capabilities from './capabilities';
import ComparisonTable from './comparison-table';
import PlatformHero from './hero';

export default function PlatformView() {
  return (
    <>
      <PlatformHero />
      <ComparisonTable />
      <Capabilities />
    </>
  );
}
