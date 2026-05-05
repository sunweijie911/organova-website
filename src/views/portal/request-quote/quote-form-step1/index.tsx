'use client';

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

export type Step1Data = {
  cancerType: string;
  drugModality: string;
  studyType: string;
  numCompounds: string;
  turnaround: string;
};

interface QuoteFormStep1Props {
  data: Step1Data;
  onChange: (
    key: keyof Step1Data,
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/* 自定义下拉 chevron 图标 */
const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="5"
    viewBox="0 0 10 5"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1l4 3 4-3"
      stroke="#000"
      strokeLinecap="round"
      strokeWidth="1.4"
    />
  </svg>
);

interface SelectFieldProps {
  id: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  value: string;
}

function SelectField({
  id,
  label,
  onChange,
  options,
  placeholder,
  required,
  value,
}: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.selectWrapper}>
        <select
          className={styles.select}
          id={id}
          onChange={onChange}
          required={required}
          value={value}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className={styles.chevron}>
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

export default function QuoteFormStep1({
  data,
  onChange,
  onSubmit,
}: QuoteFormStep1Props) {
  return (
    <form className={styles.formSection} onSubmit={onSubmit}>
      {/* 第一行：Cancer Type / Indication + Drug Modality */}
      <div className={styles.row}>
        <SelectField
          id="cancerType"
          label="Cancer Type / Indication"
          onChange={onChange('cancerType')}
          options={CANCER_TYPES}
          placeholder="Cancer Type / Indication"
          required
          value={data.cancerType}
        />
        <SelectField
          id="drugModality"
          label="Drug Modality"
          onChange={onChange('drugModality')}
          options={DRUG_MODALITIES}
          placeholder="Select Drug Modality"
          required
          value={data.drugModality}
        />
      </div>

      {/* 第二行：Study Type + Number of Compounds */}
      <div className={styles.row}>
        <SelectField
          id="studyType"
          label="Study Type"
          onChange={onChange('studyType')}
          options={STUDY_TYPES}
          placeholder="Select Study Type"
          required
          value={data.studyType}
        />
        <SelectField
          id="numCompounds"
          label="Number of Compounds to Test"
          onChange={onChange('numCompounds')}
          options={NUM_COMPOUNDS}
          placeholder="Select Number of Compounds to Test"
          required
          value={data.numCompounds}
        />
      </div>

      {/* 第三行：Desired Turnaround Time（全宽） */}
      <div className={styles.rowFull}>
        <SelectField
          id="turnaround"
          label="Desired Turnaround Time"
          onChange={onChange('turnaround')}
          options={TURNAROUNDS}
          placeholder="Select Desired Turnaround Time"
          required
          value={data.turnaround}
        />
      </div>

      {/* 提交按钮：右对齐 */}
      <div className={styles.actions}>
        <button className={styles.nextBtn} type="submit">
          <span>Next Step</span>
          {/* 箭头图标 */}
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            viewBox="0 0 26 16"
            width="26"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8h22M17 1l7 7-7 7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
