'use client';

import { useState } from 'react';
import SafeHtml from '@/components/SafeHtml';
import styles from './index.module.scss';

interface FaqItem {
  id: string | number;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string | number;
  name: string;
  items: FaqItem[];
}

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.divider} />
      <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
        <div className={styles.questionCol}>
          <button
            className={styles.questionBtn}
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className={styles.questionText}>{question}</span>
            <span className={styles.indicator}>{open ? '−' : '+'}</span>
          </button>
        </div>
        {open && (
          <SafeHtml className={`${styles.answerCol} rich-text`} html={answer} />
        )}
      </div>
    </>
  );
}

interface FaqContentProps {
  data: FaqCategory[] | undefined;
  isLoading: boolean;
  activeCategory: string;
}

export default function FaqContent({
  data,
  isLoading,
  activeCategory,
}: FaqContentProps) {
  const filtered = data?.filter((cat) => cat.name === activeCategory);
  const displayData = filtered && filtered.length > 0 ? filtered : (data ?? []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {isLoading && <div className={styles.loading}>Loading...</div>}
        {displayData.map((category) => (
          <div className={styles.category} key={category.id}>
            {(!filtered || filtered.length === 0) && (
              <h2 className={styles.categoryTitle}>{category.name}</h2>
            )}
            <div className={styles.items}>
              {category.items.map((item) => (
                <AccordionItem
                  answer={item.answer}
                  id={item.id}
                  key={item.id}
                  question={item.question}
                />
              ))}
            </div>
            <div className={styles.divider} />
          </div>
        ))}
        {!isLoading && displayData.length === 0 && (
          <p className={styles.empty}>No FAQ entries yet.</p>
        )}
      </div>
    </section>
  );
}
