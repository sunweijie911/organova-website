'use client';

import { useState } from 'react';
import { ArrowButton } from '@/components/ArrowButton';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

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

export function ContactForm() {
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

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <p>Thank you for reaching out. We will get back to you shortly.</p>
        <ArrowButton onClick={() => setSubmitted(false)}>
          Send Another Message
        </ArrowButton>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.contactSubtitle}>
        Curious about our work? Get in touch.
      </p>
      {rows.map((row) => (
        <div
          className={row.length > 1 ? styles.formRow : undefined}
          key={row.map((f) => f.key).join('-')}
        >
          {row.map((field) => {
            const isFilled = form[field.key].length > 0;
            const fieldClass = [
              row.length > 1 ? styles.formField : styles.formFieldFull,
              isFilled ? styles.isFilled : '',
            ]
              .filter(Boolean)
              .join(' ');
            const inputId = `contact-${field.key}`;
            return (
              <label className={fieldClass} htmlFor={inputId} key={field.key}>
                <span className={styles.floatingLabel}>{field.label}</span>
                {field.type === 'textarea' ? (
                  <textarea
                    aria-label={field.label}
                    className={`${styles.formInput} ${styles.formTextarea}`}
                    id={inputId}
                    onChange={handleChange(field.key)}
                    placeholder={field.label}
                    required={field.key === 'message'}
                    rows={4}
                    value={form[field.key]}
                  />
                ) : (
                  <input
                    aria-label={field.label}
                    className={styles.formInput}
                    id={inputId}
                    onChange={handleChange(field.key)}
                    placeholder={field.label}
                    required={['firstName', 'lastName', 'email'].includes(
                      field.key,
                    )}
                    type={field.type}
                    value={form[field.key]}
                  />
                )}
              </label>
            );
          })}
        </div>
      ))}
      <ArrowButton
        className={styles.submitBtn}
        disabled={submit.isPending}
        iconVisible="always"
        type="submit"
        variant="light"
      >
        {submit.isPending ? 'Submitting...' : 'Submit'}
      </ArrowButton>
      {submit.isError && (
        <p className={styles.errorMsg}>
          {submit.error?.message || 'Something went wrong. Please try again.'}
        </p>
      )}
    </form>
  );
}
