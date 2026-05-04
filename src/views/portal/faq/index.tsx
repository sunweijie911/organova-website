'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

function AccordionItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button
        className={styles.question}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{question}</span>
        <span className={styles.chevron}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div
          className={`${styles.answer} rich-text`}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      )}
    </div>
  );
}

export default function FaqView() {
  const { data, isLoading } = api.faq.listWithItems.useQuery();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Your Questions, Answered.</h1>
          <p className={styles.heroSubtitle}>
            Everything you need to know about our platform, services, and
            partnerships.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {isLoading && <div className={styles.loading}>Loading...</div>}
          {data?.map((category) => (
            <div className={styles.category} key={category.id}>
              <h2 className={styles.categoryTitle}>{category.name}</h2>
              <div className={styles.items}>
                {category.items.map((item) => (
                  <AccordionItem
                    answer={item.answer}
                    key={item.id}
                    question={item.question}
                  />
                ))}
              </div>
            </div>
          ))}
          {!isLoading && (!data || data.length === 0) && (
            <p className={styles.empty}>No FAQ entries yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
