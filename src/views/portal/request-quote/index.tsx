'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

const CANCER_TYPES = [
  'Liver Cancer (HCC / ICC)',
  'Colorectal Cancer (CRC)',
  'Kidney Cancer (ccRCC)',
  'Breast Cancer',
  'Pancreatic Cancer (PDAC)',
  'Sarcoma (GIST / OS)',
  'Lung Cancer (NSCLC)',
  'Glioblastoma (GBM)',
  'Endometrial Cancer',
  'Ovarian Cancer',
  'Gastric Cancer',
  'Biliary Tract Cancer',
  'Head & Neck Cancer',
  'Prostate Cancer',
  'Lymphoma',
  'Other',
];

const DRUG_MODALITIES = [
  'Small Molecule',
  'Biologic / Antibody',
  'ADC',
  'Immune Checkpoint Blocker (ICB)',
  'Cell Therapy (CAR-T / CAR-NK)',
  'Nucleic Acid',
  'Other',
];

const STUDY_TYPES = [
  'Drug Efficacy Screening',
  'I-O Evaluation',
  'Target Discovery',
  'Safety Assessment',
  'Biomarker Discovery',
  'Other',
];

const NUM_COMPOUNDS = ['1–5', '6–10', '11–20', '20+'];

const TURNAROUNDS = ['Standard (2–3 weeks)', 'Expedited', 'Flexible'];

type Step1 = {
  cancerType: string;
  drugModality: string;
  studyType: string;
  numCompounds: string;
  turnaround: string;
};
type Step2 = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  additionalNotes: string;
};

const INITIAL_S1: Step1 = {
  cancerType: '',
  drugModality: '',
  studyType: '',
  numCompounds: '',
  turnaround: '',
};
const INITIAL_S2: Step2 = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  phone: '',
  additionalNotes: '',
};

export default function RequestQuoteView() {
  const [step, setStep] = useState<1 | 2>(1);
  const [s1, setS1] = useState<Step1>(INITIAL_S1);
  const [s2, setS2] = useState<Step2>(INITIAL_S2);
  const [submitted, setSubmitted] = useState(false);

  const submit = api.leads.submitRfq.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const set1 = (k: keyof Step1) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setS1((p) => ({ ...p, [k]: e.target.value }));
  const set2 =
    (k: keyof Step2) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setS2((p) => ({ ...p, [k]: e.target.value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate({ ...s1, ...s2 });
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Thank You.</h1>
            <p className={styles.heroSubtitle}>
              A member of our scientific team will contact you within 1 business
              day.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Tell Us About Your Program.</h1>
          <p className={styles.heroSubtitle}>
            The more detail you provide, the faster we can design a study that
            fits your needs.
          </p>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formContainer}>
          {/* Progress */}
          <div className={styles.progress}>
            <div
              className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}
            >
              <span>1</span> Your Program
            </div>
            <div className={styles.progressLine} />
            <div
              className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}
            >
              <span>2</span> Your Contact
            </div>
          </div>

          {step === 1 && (
            <form className={styles.form} onSubmit={handleStep1}>
              <h2 className={styles.stepTitle}>Step 1 — Your Program</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cancerType">
                    Cancer Type / Indication *
                  </label>
                  <select
                    className={styles.select}
                    id="cancerType"
                    onChange={set1('cancerType')}
                    required
                    value={s1.cancerType}
                  >
                    <option value="">Select...</option>
                    {CANCER_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="drugModality">
                    Drug Modality *
                  </label>
                  <select
                    className={styles.select}
                    id="drugModality"
                    onChange={set1('drugModality')}
                    required
                    value={s1.drugModality}
                  >
                    <option value="">Select...</option>
                    {DRUG_MODALITIES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="studyType">
                    Study Type *
                  </label>
                  <select
                    className={styles.select}
                    id="studyType"
                    onChange={set1('studyType')}
                    required
                    value={s1.studyType}
                  >
                    <option value="">Select...</option>
                    {STUDY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="numCompounds">
                    Number of Compounds to Test *
                  </label>
                  <select
                    className={styles.select}
                    id="numCompounds"
                    onChange={set1('numCompounds')}
                    required
                    value={s1.numCompounds}
                  >
                    <option value="">Select...</option>
                    {NUM_COMPOUNDS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.label} htmlFor="turnaround">
                    Desired Turnaround Time *
                  </label>
                  <select
                    className={styles.select}
                    id="turnaround"
                    onChange={set1('turnaround')}
                    required
                    value={s1.turnaround}
                  >
                    <option value="">Select...</option>
                    {TURNAROUNDS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className={styles.btn} type="submit">
                Continue →
              </button>
            </form>
          )}

          {step === 2 && (
            <form className={styles.form} onSubmit={handleStep2}>
              <h2 className={styles.stepTitle}>Step 2 — Your Contact</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="firstName">
                    First Name *
                  </label>
                  <input
                    className={styles.input}
                    id="firstName"
                    onChange={set2('firstName')}
                    placeholder="First Name"
                    required
                    type="text"
                    value={s2.firstName}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="lastName">
                    Last Name *
                  </label>
                  <input
                    className={styles.input}
                    id="lastName"
                    onChange={set2('lastName')}
                    placeholder="Last Name"
                    required
                    type="text"
                    value={s2.lastName}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    className={styles.input}
                    id="email"
                    onChange={set2('email')}
                    placeholder="Email"
                    required
                    type="email"
                    value={s2.email}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="company">
                    Company *
                  </label>
                  <input
                    className={styles.input}
                    id="company"
                    onChange={set2('company')}
                    placeholder="Company"
                    required
                    type="text"
                    value={s2.company}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="jobTitle">
                    Job Title
                  </label>
                  <input
                    className={styles.input}
                    id="jobTitle"
                    onChange={set2('jobTitle')}
                    placeholder="Job Title"
                    type="text"
                    value={s2.jobTitle}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className={styles.input}
                    id="phone"
                    onChange={set2('phone')}
                    placeholder="Phone"
                    type="tel"
                    value={s2.phone}
                  />
                </div>
                <div className={styles.fieldFull}>
                  <label className={styles.label} htmlFor="additionalNotes">
                    Additional Notes
                  </label>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    id="additionalNotes"
                    onChange={set2('additionalNotes')}
                    placeholder="Tell us more about your program..."
                    rows={4}
                    value={s2.additionalNotes}
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  className={styles.btnBack}
                  onClick={() => setStep(1)}
                  type="button"
                >
                  ← Back
                </button>
                <button
                  className={styles.btn}
                  disabled={submit.isPending}
                  type="submit"
                >
                  {submit.isPending ? 'Submitting...' : 'Submit Project Brief'}
                </button>
              </div>
              {submit.isError && (
                <p className={styles.error}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
