import Link from 'next/link';
import type { ReactNode } from 'react';
import SafeHtml from '@/components/SafeHtml';
import { SvgIcon } from '@/components/SvgIcon';
import type { RouterOutputs } from '@/lib/trpc/react';
import { parseFormats } from '../utils';
import { BackLink } from './back-link';
import styles from './index.module.scss';

type CancerType = RouterOutputs['cancerTypes']['getBySlug'];

// 外链/邮件/电话用原生 a 标签 + 新窗口；站内相对路径走 Next Link 享受预取
function isExternalUrl(url: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(url);
}

function CtaItem({
  url,
  className,
  children,
}: {
  url: string | null | undefined;
  className: string | undefined;
  children: ReactNode;
}) {
  if (!url) return null;
  if (isExternalUrl(url)) {
    return (
      <a
        className={className}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={url}>
      {children}
    </Link>
  );
}

export default function DetailContent({ data }: { data: CancerType }) {
  const formats = parseFormats(data.formats);

  return (
    <div className={styles.page}>
      <div className={styles.navBar}>
        <BackLink />
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          {/* Title block */}
          <div className={styles.titleBlock}>
            <div className={styles.titleMeta}>
              <h1 className={styles.title}>{data.subpageTitle ?? data.name}</h1>

              {formats.length > 0 && (
                <div className={styles.tags}>
                  {formats.map((f) => (
                    <span className={styles.tag} key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {data.modelCountDetail && (
                <p className={styles.metaLine}>{data.modelCountDetail}</p>
              )}
            </div>
            {data.validationMethods && (
              <p className={styles.description}>{data.validationMethods}</p>
            )}
          </div>

          {/* Validated Applications */}
          {data.validatedApplications && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Validated Applications:</h2>
              <SafeHtml
                className={styles.richText}
                html={data.validatedApplications}
              />
            </div>
          )}

          {/* Clinical Correlation */}
          {data.clinicalCorrelation && (
            <div className={styles.section}>
              <h2 className={styles.sectionHeading}>Clinical Correlation:</h2>
              <p className={styles.bodyText}>{data.clinicalCorrelation}</p>
            </div>
          )}

          {/* CTA links */}
          {(data.cta1Label || data.cta2Label) && (
            <div className={styles.ctaRow}>
              {data.cta1Label && data.cta1Url && (
                <CtaItem className={styles.ctaLink} url={data.cta1Url}>
                  {data.cta1Label}
                  <SvgIcon color="#3A84FF" name="chevron-right" size={24} />
                </CtaItem>
              )}
              {data.cta2Label && data.cta2Url && (
                <CtaItem className={styles.ctaLink} url={data.cta2Url}>
                  {data.cta2Label}
                  <SvgIcon color="#3A84FF" name="chevron-right" size={24} />
                </CtaItem>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
