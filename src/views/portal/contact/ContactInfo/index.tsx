import styles from './index.module.scss';

const CONTACT_INFO = [
  { label: 'Office 1', value: 'US Headquarters\nPhiladelphia, PA' },
  { label: 'Office 2', value: 'China R&D Center\nNanjing, China' },
  { label: 'Email', value: 'info@tricbio.com', isEmail: true },
];

export function ContactInfo() {
  return (
    <div className={styles.contactInfo}>
      {CONTACT_INFO.map((item) => (
        <div className={styles.infoItem} key={item.label}>
          <span className={styles.infoLabel}>{item.label}</span>
          {item.isEmail ? (
            <a className={styles.infoEmail} href={`mailto:${item.value}`}>
              {item.value}
            </a>
          ) : (
            <p className={styles.infoValue}>{item.value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
