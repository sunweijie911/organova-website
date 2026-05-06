'use client';

import { useState } from 'react';
import SafeHtml from '@/components/SafeHtml';
import styles from './index.module.scss';

// 单个 FAQ 条目类型
interface FaqItem {
  id: string | number;
  question: string;
  answer: string;
}

// 单个 FAQ 分类类型
interface FaqCategory {
  id: string | number;
  name: string;
  items: FaqItem[];
}

// Accordion 展开/收起组件
// 布局：左列问题（550px）+ 右列答案（720px），间距 170px
function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 分隔线：Figma Vector 9/10/11/12，1px，rgba(255,255,255,0.8) */}
      <div className={styles.divider} />

      <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
        {/* 左列：问题 */}
        <div className={styles.questionCol}>
          <button
            className={styles.questionBtn}
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span className={styles.questionText}>{question}</span>
            {/* 展开/收起指示符 */}
            <span className={styles.indicator}>{open ? '−' : '+'}</span>
          </button>
        </div>

        {/* 右列：答案（展开时显示） */}
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
  // 根据激活分类过滤，若无匹配则显示全部
  const filtered = data?.filter((cat) => cat.name === activeCategory);
  const displayData = filtered && filtered.length > 0 ? filtered : (data ?? []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* 加载中状态 */}
        {isLoading && <div className={styles.loading}>Loading...</div>}

        {/* FAQ 列表 */}
        {displayData.map((category) => (
          <div className={styles.category} key={category.id}>
            {/* 分类名称（仅在显示全部时才展示分类标题） */}
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
            {/* 最后一个 item 后面也加分隔线 */}
            <div className={styles.divider} />
          </div>
        ))}

        {/* 空状态 */}
        {!isLoading && displayData.length === 0 && (
          <p className={styles.empty}>No FAQ entries yet.</p>
        )}
      </div>
    </section>
  );
}
