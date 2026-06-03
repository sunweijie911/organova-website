import { CardLink } from '@/components/CardLink';
import styles from './index.module.scss';

/**
 * Resources for Your Research 区域
 * 对应 Figma 节点 545-6284 中的 Resources 部分（Frame 84，3张卡片）
 * 白色背景，3列网格，每卡片含标题 + 描述 + CTA 按钮（Download PDF / Request Access）
 * 卡片：width 468px，padding 24px，border 1px #DCDEE5，border-radius 16px
 */
interface Resource {
  id: number;
  name: string;
  description?: string | null;
  ctaLabel?: string | null;
  ctaType?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
}

interface ResourcesSectionProps {
  resources?: Resource[];
}

interface CtaProps {
  href: string;
  target?: '_blank';
  rel?: 'noopener noreferrer';
}

// 按 ctaType 派生 a 标签属性；未知枚举或缺数据返回 null（不渲染按钮）
function getCtaProps(r: Resource): CtaProps | null {
  switch (r.ctaType) {
    case 'download':
      return r.fileUrl
        ? { href: r.fileUrl, target: '_blank', rel: 'noopener noreferrer' }
        : null;
    case 'link':
      return r.externalUrl
        ? { href: r.externalUrl, target: '_blank', rel: 'noopener noreferrer' }
        : null;
    case 'contact':
      return { href: '/contact' };
    default:
      return null;
  }
}

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
  if (!resources || resources.length === 0) return null;

  return (
    <section className={styles.section} id="resources">
      <div className={styles.inner}>
        {/* 3列卡片网格，gap:18px，对应 Frame 66 */}
        <div className={styles.grid}>
          {resources.map((r) => {
            const cta = r.ctaLabel ? getCtaProps(r) : null;
            return (
              <article className={styles.card} key={r.id}>
                <div className={styles.cardBody}>
                  {/* 卡片标题：Roboto SemiBold 600 20px，颜色 #313238 */}
                  <h3 className={styles.cardTitle}>{r.name}</h3>

                  {/* 描述文字：Roboto Regular 16px，line-height 24px，颜色 #4D4F56 */}
                  {r.description && (
                    <p className={styles.cardDesc}>{r.description}</p>
                  )}
                </div>

                {/* CTA：统一用 CardLink 组件（如 Download PDF / Request Access） */}
                {cta && (
                  <div className={styles.cardFooter}>
                    <a
                      className={styles.ctaLink}
                      href={cta.href}
                      rel={cta.rel}
                      target={cta.target}
                    >
                      <CardLink label={r.ctaLabel ?? ''} />
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
