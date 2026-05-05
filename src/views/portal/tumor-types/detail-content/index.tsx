import Image from 'next/image';
import Link from 'next/link';
import type { RouterOutputs } from '@/lib/trpc/react';
import styles from './index.module.scss';

type CancerType = RouterOutputs['cancerTypes']['getBySlug'];

function parseFormats(formats?: string | null): string[] {
  if (!formats) return [];
  return formats
    .split(/[,;|]/)
    .map((f) => f.trim())
    .filter(Boolean);
}

export default function DetailContent({ data }: { data: CancerType }) {
  const formats = parseFormats(data.formats);

  return (
    <div className={styles.page}>
      <div className={styles.navBar}>
        <Link className={styles.backLink} href="/tumor-types">
          <Image
            alt=""
            height={28}
            src="/portal/images/tumor-types/icon-arrow-left-gray.svg"
            width={28}
          />
          Back to Catalog
        </Link>
      </div>

      <div className={styles.body}>
        <div className={styles.content}>
          {/* Title block */}
          <div className={styles.titleBlock}>
            <div className={styles.titleMeta}>
              <h1 className={styles.title}>{data.subpageTitle ?? data.name}</h1>
              {data.modelCountDetail && (
                <p className={styles.metaLine}>{data.modelCountDetail}</p>
              )}
              {formats.length > 0 && (
                <div className={styles.tags}>
                  {formats.map((f) => (
                    <span className={styles.tag} key={f}>
                      {f}
                    </span>
                  ))}
                </div>
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
              <div
                className={styles.richText}
                dangerouslySetInnerHTML={{ __html: data.validatedApplications }}
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
                <Link className={styles.ctaLink} href={data.cta1Url}>
                  <Image
                    alt=""
                    height={24}
                    src="/portal/images/tumor-types/icon-arrow-right-blue.svg"
                    width={24}
                  />
                  {data.cta1Label}
                </Link>
              )}
              {data.cta2Label && data.cta2Url && (
                <Link className={styles.ctaLink} href={data.cta2Url}>
                  <Image
                    alt=""
                    height={24}
                    src="/portal/images/tumor-types/icon-arrow-right-blue.svg"
                    width={24}
                  />
                  {data.cta2Label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
