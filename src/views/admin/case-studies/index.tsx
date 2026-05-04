'use client';

import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  message,
  Space,
  Switch,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { ImageUploader } from '@/components/ImageUploader';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api } from '@/lib/trpc/react';

const CANCER_TYPE_TAGS = [
  'HCC/ICC',
  'CRC',
  'NSCLC',
  'Gastric',
  'Breast',
  'RCC',
  'GBM',
  'GIST',
  'Rare Tumors',
  'Non-Oncology',
];

const APPLICATION_TAGS = [
  'Drug Efficacy',
  'Immunotherapy',
  'ADC',
  'Target Discovery',
  'Safety & Toxicity',
  'Disease Modeling',
  'Special Models',
];

type CS = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  cancerTypeTags: string[];
  applicationTags: string[];
  challenge: string | null;
  approach: string | null;
  results: string | null;
  implication: string | null;
  metaModel: string | null;
  metaDrugClasses: string | null;
  metaReadout: string | null;
  metaValidation: string | null;
  cta1Label: string | null;
  cta1Url: string | null;
  cta2Label: string | null;
  cta2Url: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export default function AdminCaseStudiesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CS | null>(null);
  const [coverImage, setCoverImage] = useState('');
  const [challenge, setChallenge] = useState('');
  const [approach, setApproach] = useState('');
  const [results, setResults] = useState('');
  const [implication, setImplication] = useState('');
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = api.caseStudies.adminList.useQuery();

  const create = api.caseStudies.adminCreate.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const update = api.caseStudies.adminUpdate.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setModalOpen(false);
      void refetch();
    },
    onError: (e) => message.error(e.message || '操作失败'),
  });

  const del = api.caseStudies.adminDelete.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });

  const togglePublish = api.caseStudies.adminTogglePublish.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('操作失败'),
  });

  const openCreate = () => {
    setEditing(null);
    setCoverImage('');
    setChallenge('');
    setApproach('');
    setResults('');
    setImplication('');
    form.resetFields();
    form.setFieldsValue({
      isPublished: false,
      sortOrder: data?.length ?? 0,
      cancerTypeTags: [],
      applicationTags: [],
    });
    setModalOpen(true);
  };

  const openEdit = (r: CS) => {
    setEditing(r);
    setCoverImage(r.coverImage ?? '');
    setChallenge(r.challenge ?? '');
    setApproach(r.approach ?? '');
    setResults(r.results ?? '');
    setImplication(r.implication ?? '');
    form.setFieldsValue(r);
    setModalOpen(true);
  };

  const handleSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      coverImage: coverImage || undefined,
      challenge,
      approach,
      results,
      implication,
    };
    if (editing) {
      update.mutate({ id: editing.id, ...payload } as Parameters<
        typeof update.mutate
      >[0]);
    } else {
      create.mutate(payload as Parameters<typeof create.mutate>[0]);
    }
  };

  const columns: ColumnsType<CS> = [
    {
      title: '封面',
      dataIndex: 'coverImage',
      width: 60,
      render: (v: string | null) =>
        v ? (
          <img
            alt=""
            src={v}
            style={{
              width: 44,
              height: 28,
              objectFit: 'cover',
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 44,
              height: 28,
              background: '#f5f5f5',
              borderRadius: 4,
            }}
          />
        ),
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    {
      title: '标签',
      dataIndex: 'cancerTypeTags',
      width: 180,
      render: (v: string[]) =>
        v.slice(0, 2).map((t) => (
          <Tag key={t} style={{ fontSize: 11 }}>
            {t}
          </Tag>
        )),
    },
    { title: '排序', dataIndex: 'sortOrder', width: 60 },
    {
      title: '状态',
      dataIndex: 'isPublished',
      width: 80,
      render: (v: boolean) => (
        <Tag color={v ? 'success' : 'default'}>{v ? '已上线' : '草稿'}</Tag>
      ),
    },
    {
      title: '操作',
      width: 170,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEdit(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            onClick={() =>
              togglePublish.mutate({ id: r.id, isPublished: !r.isPublished })
            }
            size="small"
            type="link"
          >
            {r.isPublished ? '下线' : '上线'}
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: '确认删除？',
                content: r.title,
                okType: 'danger',
                onOk: () => del.mutate({ id: r.id }),
              })
            }
            size="small"
            type="link"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={openCreate} type="primary">
          + 添加案例研究
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data ?? []}
        loading={isLoading}
        pagination={false}
        rowKey="id"
        size="middle"
      />

      <Modal
        destroyOnClose
        footer={
          <Button
            block
            loading={create.isPending || update.isPending}
            onClick={() => form.submit()}
            type="primary"
          >
            保存
          </Button>
        }
        onCancel={() => setModalOpen(false)}
        open={modalOpen}
        styles={{
          body: { maxHeight: '72vh', overflowY: 'auto', paddingRight: 8 },
        }}
        title={editing ? '编辑案例研究' : '添加案例研究'}
        width={860}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="URL Slug"
            name="slug"
            rules={[
              { required: true },
              { pattern: /^[a-z0-9-]+$/, message: '小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="liver-cancer-drug-response" />
          </Form.Item>
          <Form.Item label="摘要（卡片一行显示）" name="summary">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="封面图片">
            <ImageUploader
              module="portal"
              onChange={(url) => setCoverImage(url ?? '')}
              value={coverImage}
            />
          </Form.Item>
          <Form.Item label="Cancer Type 标签" name="cancerTypeTags">
            <Checkbox.Group
              options={CANCER_TYPE_TAGS}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            />
          </Form.Item>
          <Form.Item label="Application 标签" name="applicationTags">
            <Checkbox.Group
              options={APPLICATION_TAGS}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            />
          </Form.Item>
          <Form.Item label="Challenge（富文本）">
            <RichTextEditor
              defaultValue={challenge}
              key={editing?.id ?? 'new'}
              onChange={setChallenge}
            />
          </Form.Item>
          <Form.Item label="Approach（富文本）">
            <RichTextEditor
              defaultValue={approach}
              key={editing?.id ?? 'new'}
              onChange={setApproach}
            />
          </Form.Item>
          <Form.Item label="Results（富文本）">
            <RichTextEditor
              defaultValue={results}
              key={editing?.id ?? 'new'}
              onChange={setResults}
            />
          </Form.Item>
          <Form.Item label="Implication（富文本）">
            <RichTextEditor
              defaultValue={implication}
              key={editing?.id ?? 'new'}
              onChange={setImplication}
            />
          </Form.Item>
          <Form.Item label="元数据 - Model" name="metaModel">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Drug Classes" name="metaDrugClasses">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Readout" name="metaReadout">
            <Input />
          </Form.Item>
          <Form.Item label="元数据 - Validation" name="metaValidation">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 1 文字" name="cta1Label">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 1 链接" name="cta1Url">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 2 文字" name="cta2Label">
            <Input />
          </Form.Item>
          <Form.Item label="CTA 2 链接" name="cta2Url">
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="sortOrder">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="上线" name="isPublished" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
