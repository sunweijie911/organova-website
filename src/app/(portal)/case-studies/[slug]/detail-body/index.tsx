import Link from 'next/link';
import SafeHtml from '@/components/SafeHtml';
import styles from './index.module.scss';

interface Props {
  // 正文内容（rich-text HTML）
  challenge?: string | null;
  approach?: string | null;
  results?: string | null;
  implication?: string | null;
  // 侧边栏 metadata
  metaModel?: string | null;
  metaDrugClasses?: string | null;
  metaReadout?: string | null;
  metaValidation?: string | null;
  // CTA 按钮
  cta1Label?: string | null;
  cta1Url?: string | null;
  cta2Label?: string | null;
  cta2Url?: string | null;
}

// 将逗号或换行分隔的字符串转为标签数组
function parseMetaTags(value: string): string[] {
  return value
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// 侧边栏 Metadata 行
function MetaRow({ label, value }: { label: string; value: string }) {
  const tags = parseMetaTags(value);
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaRowLabel}>{label}:</span>
      <div className={styles.metaTagList}>
        {tags.map((t) => (
          <span className={styles.metaTag} key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// 详情页正文 + 侧边栏区域
// Figma: 左栏（Frame 84 layout_H3RG7B: column, gap 24px, width 1440）+ 右栏（侧边 metadata 卡片）
// 内容卡片：column, padding 24px, border-radius 16px, border 1px #DCDEE5
// 内容标题：Roboto Medium 500 24px，#313238
// 内容正文 style_T2YO9S: Roboto Regular 16px, line-height 24px, fill_6I43LG → #4D4F56
export default function DetailBody({
  challenge,
  approach,
  results,
  implication,
  metaModel,
  metaDrugClasses,
  metaReadout,
  metaValidation,
  cta1Label,
  cta1Url,
  cta2Label,
  cta2Url,
}: Props) {
  const hasMetadata =
    metaModel || metaDrugClasses || metaReadout || metaValidation;
  const hasCta = cta1Label || cta2Label;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* 左侧主内容区 */}
        <div className={styles.main}>
          {/* Challenge */}
          {challenge && (
            <div className={styles.contentCard}>
              <div className={styles.contentCardInner}>
                <h2 className={styles.contentLabel}>Challenge</h2>
                <SafeHtml
                  className={`rich-text ${styles.richText}`}
                  html={challenge}
                />
              </div>
            </div>
          )}

          {/* Approach */}
          {approach && (
            <div className={styles.contentCard}>
              <div className={styles.contentCardInner}>
                <h2 className={styles.contentLabel}>Approach</h2>
                <SafeHtml
                  className={`rich-text ${styles.richText}`}
                  html={approach}
                />
              </div>
            </div>
          )}

          {/* Results */}
          {results && (
            <div className={styles.contentCard}>
              <div className={styles.contentCardInner}>
                <h2 className={styles.contentLabel}>Results:</h2>
                <SafeHtml
                  className={`rich-text ${styles.richText}`}
                  html={results}
                />
              </div>
            </div>
          )}

          {/* Implication */}
          {implication && (
            <div className={styles.contentCard}>
              <div className={styles.contentCardInner}>
                <h2 className={styles.contentLabel}>Implication</h2>
                <SafeHtml
                  className={`rich-text ${styles.richText}`}
                  html={implication}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右侧侧边栏（Study Details + CTA） */}
        {(hasMetadata || hasCta) && (
          <aside className={styles.sidebar}>
            {/* Study Details 卡片 */}
            {hasMetadata && (
              <div className={styles.sideCard}>
                {/* 侧边栏无单独标题，Figma 直接是 metadata 行列表 */}
                <div className={styles.metaList}>
                  {metaModel && <MetaRow label="Model" value={metaModel} />}
                  {metaDrugClasses && (
                    <MetaRow label="Drug Classes" value={metaDrugClasses} />
                  )}
                  {metaReadout && (
                    <MetaRow label="Readout" value={metaReadout} />
                  )}
                  {metaValidation && (
                    <MetaRow label="Validation" value={metaValidation} />
                  )}
                </div>
              </div>
            )}

            {/* CTA 按钮区 */}
            {hasCta && (
              <div className={styles.ctaBox}>
                {cta1Label && cta1Url && (
                  <Link className={styles.ctaBtn} href={cta1Url}>
                    {cta1Label}
                  </Link>
                )}
                {cta2Label && cta2Url && (
                  <Link className={styles.ctaBtnSecondary} href={cta2Url}>
                    {cta2Label}
                  </Link>
                )}
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
