'use client';

import {
  Badge,
  Button,
  Descriptions,
  Drawer,
  Input,
  message,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { api } from '@/lib/trpc/react';

const { Text } = Typography;
const { Search } = Input;

type Lead = {
  id: number;
  source: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  jobTitle: string | null;
  message: string | null;
  cancerType: string | null;
  drugModality: string | null;
  studyType: string | null;
  numCompounds: string | null;
  turnaround: string | null;
  phone: string | null;
  additionalNotes: string | null;
  createdAt: Date;
};

const STATUS_COLOR: Record<string, string> = {
  new: 'blue',
  following: 'orange',
  closed: 'default',
};

const STATUS_LABEL: Record<string, string> = {
  new: '新建',
  following: '跟进中',
  closed: '已关闭',
};

function exportToCsv(rows: Lead[]) {
  const headers = [
    '来源',
    '状态',
    '姓名',
    '邮箱',
    '公司',
    '职位',
    '电话',
    '留言',
    '癌种',
    '药物类型',
    '研究类型',
    '化合物数量',
    '交付时间',
    '备注',
    '提交时间',
  ];
  const csvEscape = (v: string | null | undefined) =>
    v ? `"${v.replace(/"/g, '""')}"` : '';

  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.source === 'contact' ? 'Contact' : 'RFQ',
        STATUS_LABEL[r.status] ?? r.status,
        `${r.firstName} ${r.lastName}`,
        r.email,
        csvEscape(r.company),
        csvEscape(r.jobTitle),
        csvEscape(r.phone),
        csvEscape(r.message),
        csvEscape(r.cancerType),
        csvEscape(r.drugModality),
        csvEscape(r.studyType),
        csvEscape(r.numCompounds),
        csvEscape(r.turnaround),
        csvEscape(r.additionalNotes),
        dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      ].join(','),
    ),
  ];

  const blob = new Blob([`﻿${lines.join('\n')}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads_${dayjs().format('YYYYMMDD_HHmm')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminLeadsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<'contact' | 'rfq' | undefined>();
  const [status, setStatus] = useState<
    'new' | 'following' | 'closed' | undefined
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, refetch } = api.leads.adminList.useQuery({
    page,
    pageSize: 20,
    search: search || undefined,
    source,
    status,
  });

  const exportQuery = api.leads.adminExportAll.useQuery(
    { search: search || undefined, source, status },
    { enabled: false },
  );

  const updateStatus = api.leads.adminUpdateStatus.useMutation({
    onSuccess: (_, vars) => {
      message.success('状态已更新');
      // 更新抽屉内选中记录的状态，无需关闭
      setSelected((prev) =>
        prev && prev.id === vars.id ? { ...prev, status: vars.status } : prev,
      );
      void refetch();
    },
    onError: () => message.error('更新失败'),
  });

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportQuery.refetch();
      if (result.data) exportToCsv(result.data as Lead[]);
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const columns: ColumnsType<Lead> = [
    {
      title: '来源',
      dataIndex: 'source',
      width: 90,
      render: (v: string) => (
        <Tag color={v === 'contact' ? 'purple' : 'geekblue'}>
          {v === 'contact' ? 'Contact' : 'RFQ'}
        </Tag>
      ),
    },
    {
      title: '姓名',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
      width: 140,
    },
    { title: '公司', dataIndex: 'company', ellipsis: true },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => (
        <Badge color={STATUS_COLOR[v]} text={STATUS_LABEL[v]} />
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'createdAt',
      width: 150,
      render: (v: Date) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 70,
      render: (_, r) => (
        <Button
          onClick={() => {
            setSelected(r);
            setDrawerOpen(true);
          }}
          size="small"
          type="link"
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Space wrap>
          <Search
            allowClear
            onSearch={handleSearch}
            placeholder="搜索姓名 / 公司 / 邮箱"
            style={{ width: 240 }}
          />
          <Select
            allowClear
            onChange={(v) => {
              setSource(v);
              setPage(1);
            }}
            options={[
              { value: 'contact', label: 'Contact' },
              { value: 'rfq', label: 'RFQ' },
            ]}
            placeholder="来源"
            style={{ width: 120 }}
          />
          <Select
            allowClear
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={[
              { value: 'new', label: '新建' },
              { value: 'following', label: '跟进中' },
              { value: 'closed', label: '已关闭' },
            ]}
            placeholder="状态"
            style={{ width: 120 }}
          />
        </Space>
        <Space>
          <Text type="secondary">共 {data?.total ?? 0} 条</Text>
          <Button loading={exporting} onClick={handleExport}>
            导出 CSV
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total: data?.total ?? 0,
          onChange: setPage,
          showSizeChanger: false,
        }}
        rowKey="id"
        size="middle"
      />

      {/* 线索详情 —— 只读展示，保留 Drawer 交互模式 */}
      <Drawer
        extra={
          selected && (
            <Select
              loading={updateStatus.isPending}
              onChange={(v) =>
                updateStatus.mutate({
                  id: selected.id,
                  status: v as 'new' | 'following' | 'closed',
                })
              }
              options={[
                { value: 'new', label: '新建' },
                { value: 'following', label: '跟进中' },
                { value: 'closed', label: '已关闭' },
              ]}
              style={{ width: 120 }}
              value={selected.status}
            />
          )
        }
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        title={
          selected ? `${selected.firstName} ${selected.lastName}` : '线索详情'
        }
        width={560}
      >
        {selected && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="来源">
              <Tag
                color={selected.source === 'contact' ? 'purple' : 'geekblue'}
              >
                {selected.source === 'contact' ? 'Contact' : 'RFQ'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                color={STATUS_COLOR[selected.status]}
                text={STATUS_LABEL[selected.status]}
              />
            </Descriptions.Item>
            <Descriptions.Item label="姓名">
              {selected.firstName} {selected.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">{selected.email}</Descriptions.Item>
            {selected.company && (
              <Descriptions.Item label="公司">
                {selected.company}
              </Descriptions.Item>
            )}
            {selected.jobTitle && (
              <Descriptions.Item label="职位">
                {selected.jobTitle}
              </Descriptions.Item>
            )}
            {selected.phone && (
              <Descriptions.Item label="电话">
                {selected.phone}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="提交时间">
              {dayjs(selected.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            {selected.message && (
              <Descriptions.Item label="留言">
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </span>
              </Descriptions.Item>
            )}
            {selected.cancerType && (
              <Descriptions.Item label="癌种">
                {selected.cancerType}
              </Descriptions.Item>
            )}
            {selected.drugModality && (
              <Descriptions.Item label="药物类型">
                {selected.drugModality}
              </Descriptions.Item>
            )}
            {selected.studyType && (
              <Descriptions.Item label="研究类型">
                {selected.studyType}
              </Descriptions.Item>
            )}
            {selected.numCompounds && (
              <Descriptions.Item label="化合物数量">
                {selected.numCompounds}
              </Descriptions.Item>
            )}
            {selected.turnaround && (
              <Descriptions.Item label="交付时间">
                {selected.turnaround}
              </Descriptions.Item>
            )}
            {selected.additionalNotes && (
              <Descriptions.Item label="备注">
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {selected.additionalNotes}
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
