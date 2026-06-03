import Link from 'next/link';
import SafeHtml from '@/components/SafeHtml';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

interface Props {
  // 正文内容（rich-text HTML）
  challenge?: string | null;
  approach?: string | null;
  results?: string | null;
  implication?: string | null;
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
}: Props) {
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
      </div>

      {/* 底部返回入口：方便用户滑动到底部时返回画廊 */}
      <div className={styles.backToGallery}>
        <Link className={styles.backToGalleryBtn} href="/case-studies">
          <SvgIcon className={styles.backIcon} name="chevron-left" size={28} />
          <span>Back to Gallery</span>
        </Link>
      </div>
    </section>
  );
}
