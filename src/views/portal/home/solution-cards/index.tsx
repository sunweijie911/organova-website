import Link from 'next/link';
import styles from './index.module.scss';

const CARDS = {
  title: 'One Platform. Every Oncology Challenge.',
  list: [
    {
      icon: '/portal/images/home/icons/icon-flask.svg',
      title: 'For Pharma Partners',
      description:
        'De-risk your pipeline with 84.43%-accurate clinical prediction.',
      cta: 'Explore Solutions',
      href: '/pharma-solutions',
    },
    {
      icon: '/portal/images/home/icons/icon-shield.svg',
      title: 'For I-O Programs',
      description:
        'Test your immunotherapy in a model that actually has an immune system.',
      cta: 'Explore I-O Capabilities',
      href: '/immuno-oncology',
    },
    {
      icon: '/portal/images/home/icons/icon-link.svg',
      title: 'For Biotech Partners',
      description:
        'From co-discovery to co-development—we build the science together.',
      cta: 'Explore Partnerships',
      href: '/biotech-partnerships',
    },
    {
      icon: '/portal/images/home/icons/icon-database.svg',
      title: 'Explore Our Biobank',
      description: '1,500+ models across 20+ cancer types. Find your model.',
      cta: 'Browse Tumor Types',
      href: '/tumor-types',
    },
  ],
};

export default function SolutionCards() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{CARDS.title}</h2>
      <div className={styles.grid}>
        {CARDS.list.map((card) => (
          <div className={styles.card} key={card.title}>
            <div className={styles.iconWrapper}>
              {/* biome-ignore lint/performance/noImgElement: static SVG icon */}
              <img alt="" className={styles.icon} src={card.icon} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
              <Link className={styles.link} href={card.href}>
                <span className={styles.linkText}>{card.cta}</span>
                {/* biome-ignore lint/performance/noImgElement: static SVG icon */}
                <img
                  alt=""
                  className={styles.linkArrow}
                  src="/portal/images/home/icons/icon-arrow-right.svg"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
