import { PageHero } from '@/components/PageHero';

// 列表页 Hero —— 复用门户深色图片 Hero 模板（与 tumor-types / immuno-oncology 一致）
// Figma 节点 539:1770：背景图 + 径向遮罩，标题 Roboto Serif 64px，副标题 Roboto 24px
export default function ListHero() {
  return (
    <PageHero
      bgSrc="/assets/images/case-studies/hero-bg.png"
      subtitle="Explore real-world examples of how our platform is helping partners overcome their toughest preclinical challenges."
      title={`From Biological Question to \nClinical Insight.`}
    />
  );
}
