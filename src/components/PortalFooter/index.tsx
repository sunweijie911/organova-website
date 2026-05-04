import styles from './index.module.scss';

const FOOTER = {
  tagline: 'Decoding Cancer',
  address: 'OrgaNova TRiCBiO\nPhiladelphia,\nPA & Nanjing,\nChina',
  social: [
    { label: 'LinkedIn', url: '' },
    { label: 'X', url: '' },
    { label: 'YouTube', url: '' },
    { label: 'info@tricbio.com', url: 'mailto:info@tricbio.com' },
  ],
  copyright: 'OrgaNova © 2026. All Rights Reserved.',
};

export function PortalFooter() {
  return (
    <footer className={styles.footer} id="site-footer">
      <h2 className={styles.tagline}>{FOOTER.tagline}</h2>
      <div className={styles.right}>
        <div className={styles.info}>
          <div className={styles.address}>{FOOTER.address}</div>
          <div className={styles.social}>
            {FOOTER.social.map((s) => (
              <a
                className={styles.socialLink}
                href={s.url || '#'}
                key={s.label}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <p className={styles.copyright}>{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
