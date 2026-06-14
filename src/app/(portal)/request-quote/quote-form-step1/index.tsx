'use client';

import { useMemo, useState } from 'react';
import { ArrowButton } from '@/components/ArrowButton';
import { PortalSelect } from '@/components/PortalSelect';
import { api } from '@/lib/trpc/react';
import styles from './index.module.scss';

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

/* 所有字段均为必填 */
const REQUIRED_FIELDS: (keyof Step1Data)[] = [
  'cancerType',
  'drugModality',
  'studyType',
  'numCompounds',
  'turnaround',
];

const REQUIRED_MESSAGE = 'This field is required.';

interface QuoteFormStep1Props {
  data: Step1Data;
  onChange: (key: keyof Step1Data) => (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function QuoteFormStep1({
  data,
  onChange,
  onSubmit,
}: QuoteFormStep1Props) {
  // 癌种来自后台 cancerTypes 接口，与 /tumor-types 列表共享数据源
  const { data: cancerTypeList } = api.cancerTypes.list.useQuery();
  const cancerOptions = useMemo(() => {
    const names = cancerTypeList?.map((ct) => ct.name) ?? [];
    return [...names, 'Other'];
  }, [cancerTypeList]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof Step1Data, string>>
  >({});

  /* 包裹父级 onChange：选值后清除该字段错误 */
  const handleChange = (key: keyof Step1Data) => (value: string) => {
    onChange(key)(value);
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* 校验全部必填项，通过才进入下一步 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof Step1Data, string>> = {};
    for (const key of REQUIRED_FIELDS) {
      if (!data[key]) {
        nextErrors[key] = REQUIRED_MESSAGE;
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSubmit(e);
  };

  return (
    <form className={styles.formSection} noValidate onSubmit={handleSubmit}>
      {/* 第一行：Cancer Type / Indication + Drug Modality */}
      <div className={styles.row}>
        <PortalSelect
          error={errors.cancerType}
          id="cancerType"
          label="Cancer Type / Indication"
          onChange={handleChange('cancerType')}
          options={cancerOptions}
          placeholder="Cancer Type / Indication"
          value={data.cancerType}
        />
        <PortalSelect
          error={errors.drugModality}
          id="drugModality"
          label="Drug Modality"
          onChange={handleChange('drugModality')}
          options={DRUG_MODALITIES}
          placeholder="Select Drug Modality"
          value={data.drugModality}
        />
      </div>

      {/* 第二行：Study Type + Number of Compounds */}
      <div className={styles.row}>
        <PortalSelect
          error={errors.studyType}
          id="studyType"
          label="Study Type"
          onChange={handleChange('studyType')}
          options={STUDY_TYPES}
          placeholder="Select Study Type"
          value={data.studyType}
        />
        <PortalSelect
          error={errors.numCompounds}
          id="numCompounds"
          label="Number of Compounds to Test"
          onChange={handleChange('numCompounds')}
          options={NUM_COMPOUNDS}
          placeholder="Select Number of Compounds to Test"
          value={data.numCompounds}
        />
      </div>

      {/* 第三行：Desired Turnaround Time（全宽） */}
      <div className={styles.rowFull}>
        <PortalSelect
          error={errors.turnaround}
          id="turnaround"
          label="Desired Turnaround Time"
          onChange={handleChange('turnaround')}
          options={TURNAROUNDS}
          placeholder="Select Desired Turnaround Time"
          value={data.turnaround}
        />
      </div>

      {/* 提交按钮：右对齐 */}
      <div className={styles.actions}>
        <ArrowButton type="submit">Next Step</ArrowButton>
      </div>
    </form>
  );
}
