import Link from 'next/link';
import styles from './index.module.scss';

interface Props {
  title: string;
  summary?: string | null;
  cancerTypeTags: string[];
  applicationTags: string[];
}

// 右箭头（← 方向，Back 链接用）
function BackArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="28"
      viewBox="0 0 28 28"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 14H10M10 14L14.5 9.5M10 14L14.5 18.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// 详情页 Hero 区域
// Figma: layout_I2APNS: padding 24px 240px，背景 #FFFFFF，box-shadow 0px 2px 4px 0px rgba(33,46,56,0.15)
// 标题：Roboto Regular 32px，#000000
// Back 链接：Roboto Regular 20px，颜色 #979BA5
// 标签 layout_P8ZZ3S：padding 4px 16px, border-radius 16px，fill_SM3U3C → #F0F1F5
export default function DetailHero({
  title,
  summary,
  cancerTypeTags,
  applicationTags,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Back 链接 */}
        <Link className={styles.backLink} href="/case-studies">
          <BackArrowIcon />
          <span>Back to Gallery</span>
        </Link>

        {/* 标题 + 标签区 */}
        <div className={styles.content}>
          {/* 标题 */}
          <h1 className={styles.title}>{title}</h1>

          {/* 摘要 */}
          {summary && <p className={styles.summary}>{summary}</p>}

          {/* 标签行 */}
          <div className={styles.tagRow}>
            {cancerTypeTags.map((t) => (
              <span className={styles.tag} key={t}>
                {t}
              </span>
            ))}
            {applicationTags.map((t) => (
              <span className={styles.tag} key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
