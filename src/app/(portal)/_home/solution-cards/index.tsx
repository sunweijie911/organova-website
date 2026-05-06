import Link from 'next/link';
import type { IconName } from '@/components/SvgIcon';
import { SvgIcon } from '@/components/SvgIcon';
import styles from './index.module.scss';

const CARDS: {
  title: string;
  list: {
    icon: IconName;
    title: string;
    description: string;
    cta: string;
    href: string;
  }[];
} = {
  title: 'One Platform. Every Oncology Challenge.',
  list: [
    {
      icon: 'flask',
      title: 'For Pharma Partners',
      description:
        'De-risk your pipeline with 84.43%-accurate clinical prediction.',
      cta: 'Explore Solutions',
      href: '/pharma-solutions',
    },
    {
      icon: 'shield',
      title: 'For I-O Programs',
      description:
        'Test your immunotherapy in a model that actually has an immune system.',
      cta: 'Explore I-O Capabilities',
      href: '/immuno-oncology',
    },
    {
      icon: 'link',
      title: 'For Biotech Partners',
      description:
        'From co-discovery to co-development—we build the science together.',
      cta: 'Explore Partnerships',
      href: '/biotech-partnerships',
    },
    {
      icon: 'database',
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
              <SvgIcon className={styles.icon} name={card.icon} size={32} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.description}</p>
              <Link className={styles.link} href={card.href}>
                <span className={styles.linkText}>{card.cta}</span>
                <SvgIcon
                  className={styles.linkArrow}
                  name="arrow-right"
                  size={32}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
