'use client';

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

/** 问题与答案直接平铺展示，无展开/收起切换 */
function FaqEntry({ question, answer }: FaqItem) {
  return (
    <>
      <div className={styles.divider} />
      <div className={styles.item}>
        <div className={styles.questionCol}>
          <h3 className={styles.questionText}>{question}</h3>
        </div>
        <SafeHtml className={`${styles.answerCol} rich-text`} html={answer} />
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
                <FaqEntry
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
