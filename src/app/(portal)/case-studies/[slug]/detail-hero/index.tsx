import { SvgIcon } from '@/components/SvgIcon';
import { BackLink } from '../back-link';
import styles from './index.module.scss';

interface Props {
  title: string;
  cancerTypeTags: string[];
  applicationTags: string[];
}

// 详情页 Hero 区域
// Figma: layout_I2APNS: padding 24px 240px，背景 #FFFFFF，box-shadow 0px 2px 4px 0px rgba(33,46,56,0.15)
// 标题：Roboto Regular 32px，#000000
// Back 链接：Roboto Regular 20px，颜色 #979BA5
// 标签 layout_P8ZZ3S：padding 4px 16px, border-radius 16px，fill_SM3U3C → #F0F1F5
export default function DetailHero({
  title,
  cancerTypeTags,
  applicationTags,
}: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {/* Back 链接 */}
        <BackLink className={styles.backLink}>
          <SvgIcon className={styles.backIcon} name="chevron-left" size={28} />
          <span>Back to Gallery</span>
        </BackLink>

        {/* 标题 + 标签区 */}
        <div className={styles.content}>
          {/* 标题 */}
          <h1 className={styles.title}>{title}</h1>

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
