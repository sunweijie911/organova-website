'use client';

import { useState } from 'react';
import { ArrowButton } from '@/components/ArrowButton';
import { FloatingField } from '@/components/FloatingField';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

const FIELDS = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    half: true,
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    half: true,
    required: true,
  },
  {
    key: 'email',
    label: 'Email Address',
    type: 'email',
    half: false,
    required: true,
  },
  {
    key: 'company',
    label: 'Company',
    type: 'text',
    half: true,
    required: false,
  },
  {
    key: 'jobTitle',
    label: 'Job Title',
    type: 'text',
    half: true,
    required: false,
  },
  {
    key: 'message',
    label: 'Message',
    type: 'textarea',
    half: false,
    required: true,
  },
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

  const handleChange = (key: FormKey) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
          {row.map((field) => (
            <FloatingField
              className={row.length > 1 ? styles.fieldHalf : styles.fieldFull}
              id={`contact-${field.key}`}
              key={field.key}
              label={field.label}
              multiline={field.type === 'textarea'}
              onChange={handleChange(field.key)}
              required={field.required}
              type={field.type === 'textarea' ? 'text' : field.type}
              value={form[field.key]}
            />
          ))}
        </div>
      ))}
      <ArrowButton
        className={styles.submitBtn}
        disabled={submit.isPending}
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
