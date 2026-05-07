import styles from './index.module.scss';

/**
 * Publications 列表组件
 * 对应 Figma 节点 545-6284（Publications 列表区域）
 * 白色背景，两列网格，每个卡片包含占位图 + 日期期刊 + 标题 + 作者 + "Read more"
 */
interface Publication {
  id: number;
  year: number;
  journal: string;
  title: string;
  doi?: string | null;
  authors: string;
  citationCount?: string | null;
}

interface PublicationsListProps {
  publications?: Publication[];
}

// DOI 既可能是裸格式（10.xxx/yyy）也可能是完整 URL；裸格式必须前缀 doi.org，
// 否则会被当成站内相对路径解析成 /publications/10.xxx/yyy。
// cspell:ignore yyy
function toDoiHref(doi: string): string {
  return /^https?:\/\//i.test(doi) ? doi : `https://doi.org/${doi}`;
}

export default function PublicationsList({
  publications,
}: PublicationsListProps) {
  return (
    <section className={styles.section} id="publications">
      <div className={styles.inner}>
        {/* 两列卡片网格 */}
        <div className={styles.grid}>
          {publications?.map((pub) => {
            const doiHref = pub.doi ? toDoiHref(pub.doi) : null;
            return (
              <article className={styles.card} key={pub.id}>
                {/* 占位图区域：Figma 中为 452×280 的灰色矩形 */}
                <div aria-hidden="true" className={styles.imgPlaceholder} />

                {/* 卡片内容区 */}
                <div className={styles.body}>
                  {/* 日期 + 期刊名 */}
                  <div className={styles.meta}>
                    <span className={styles.year}>{pub.year}</span>
                    <span className={styles.journal}>{pub.journal}</span>
                  </div>

                  {/* 标题：Roboto Serif Regular 20px，可点击链接 */}
                  <p className={styles.title}>
                    {doiHref ? (
                      <a
                        className={styles.titleLink}
                        href={doiHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </p>

                  {/* 底部：引用数 + Read more */}
                  <div className={styles.footer}>
                    {/* 作者 / 引用数 */}
                    {pub.citationCount && pub.citationCount !== '—' ? (
                      <span className={styles.citation}>
                        {pub.citationCount}
                      </span>
                    ) : (
                      <span className={styles.authors}>{pub.authors}</span>
                    )}

                    {/* Read more 链接 */}
                    {doiHref && (
                      <a
                        className={styles.readMore}
                        href={doiHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Read more {/* 箭头图标 inline SVG */}
                        <svg
                          aria-hidden="true"
                          fill="none"
                          height="11"
                          viewBox="0 0 17 11"
                          width="17"
                        >
                          <path
                            d="M1 5.5H15.5M15.5 5.5L11 1M15.5 5.5L11 10"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 空状态 */}
        {!publications?.length && (
          <p className={styles.empty}>Publications coming soon.</p>
        )}
      </div>
    </section>
  );
}
