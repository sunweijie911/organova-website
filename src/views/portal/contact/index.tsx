'use client';

import { useState } from 'react';
import { HomeButton } from '@/components/HomeButton';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

const CONTACT_INFO = [
  { label: 'Office 1', value: 'US Headquarters\nPhiladelphia, PA' },
  { label: 'Office 2', value: 'China R&D Center\nNanjing, China' },
  { label: 'Email', value: 'info@tricbio.com', isEmail: true },
];

const FIELDS = [
  { key: 'firstName', label: 'First Name', type: 'text', half: true },
  { key: 'lastName', label: 'Last Name', type: 'text', half: true },
  { key: 'email', label: 'Email Address', type: 'email', half: false },
  { key: 'company', label: 'Company', type: 'text', half: true },
  { key: 'jobTitle', label: 'Job Title', type: 'text', half: true },
  { key: 'message', label: 'Message', type: 'textarea', half: false },
] as const;

type FormKey = (typeof FIELDS)[number]['key'];
type FormData = Record<FormKey, string>;

const INITIAL_FORM: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  message: '',
};

// 将字段按行分组（两个 half 合并为一行）
function groupRows(fields: typeof FIELDS) {
  const rows: (typeof FIELDS)[number][][] = [];
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    if (!f) break;
    const next = fields[i + 1];
    if (f.half && next?.half) {
      rows.push([f, next]);
      i += 2;
    } else {
      rows.push([f]);
      i += 1;
    }
  }
  return rows;
}

const rows = groupRows(FIELDS);

export default function ContactView() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const submit = api.leads.submitContact.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm(INITIAL_FORM);
    },
  });

  const handleChange =
    (key: FormKey) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      company: form.company || undefined,
      jobTitle: form.jobTitle || undefined,
      message: form.message,
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.contactSection}>
        <div className={styles.sectionLogos}>
          <img
            alt="logo1"
            className={styles.sectionLogo}
            src="/portal/images/home/icons/logo1.svg"
          />
          <img
            alt="logo2"
            className={styles.sectionLogo}
            src="/portal/images/home/icons/logo2.svg"
          />
        </div>
        <div className={styles.contactContent}>
          <h1 className={styles.contactTitle}>Contact</h1>
          <div className={styles.contentLayout}>
            {submitted ? (
              <div className={styles.successMessage}>
                <p>
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <HomeButton onClick={() => setSubmitted(false)}>
                  Send Another Message
                </HomeButton>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <p className={styles.contactSubtitle}>
                  Curious about our work? Get in touch.
                </p>
                {rows.map((row) => (
                  <div
                    className={row.length > 1 ? styles.formRow : undefined}
                    key={row.map((f) => f.key).join('-')}
                  >
                    {row.map((field) => (
                      <div
                        className={
                          row.length > 1
                            ? styles.formField
                            : styles.formFieldFull
                        }
                        key={field.key}
                      >
                        {field.type === 'textarea' ? (
                          <textarea
                            className={`${styles.formInput} ${styles.formTextarea}`}
                            onChange={handleChange(field.key)}
                            placeholder={field.label}
                            required={field.key === 'message'}
                            rows={4}
                            value={form[field.key]}
                          />
                        ) : (
                          <input
                            className={styles.formInput}
                            onChange={handleChange(field.key)}
                            placeholder={field.label}
                            required={[
                              'firstName',
                              'lastName',
                              'email',
                            ].includes(field.key)}
                            type={field.type}
                            value={form[field.key]}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <HomeButton
                  className={styles.submitBtn}
                  onClick={undefined}
                  type="submit"
                >
                  {submit.isPending ? 'Submitting...' : 'Submit'}
                </HomeButton>
                {submit.isError && (
                  <p className={styles.errorMsg}>
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
            <div className={styles.contactInfo}>
              {CONTACT_INFO.map((item) => (
                <div className={styles.infoItem} key={item.label}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.isEmail ? (
                    <a
                      className={styles.infoEmail}
                      href={`mailto:${item.value}`}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className={styles.infoValue}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
