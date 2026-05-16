'use client';

import {
  App,
  Badge,
  Button,
  Descriptions,
  Drawer,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { EllipsisCell } from '@/components/EllipsisCell';
import { exportToXlsx, type XlsxColumn } from '@/lib/export-xlsx';
import { api, type RouterOutputs } from '@/lib/trpc/react';
import {
  LEAD_SOURCE_LABELS,
  LEAD_SOURCE_TAG_COLORS,
  LEAD_SOURCES,
  LEAD_STATUS_BADGE_COLORS,
  LEAD_STATUS_LABELS,
  LEAD_STATUSES,
  type LeadSource,
  type LeadStatus,
  toSelectOptions,
} from '@/types/enums';

const { Text } = Typography;
const { Search } = Input;

type Lead = RouterOutputs['leads']['adminList']['items'][number];

const LEAD_EXPORT_COLUMNS: XlsxColumn<Lead>[] = [
  {
    header: '来源',
    accessor: (r) => LEAD_SOURCE_LABELS[r.source as LeadSource] ?? r.source,
  },
  {
    header: '状态',
    accessor: (r) => LEAD_STATUS_LABELS[r.status as LeadStatus] ?? r.status,
  },
  { header: '姓名', accessor: (r) => `${r.firstName} ${r.lastName}` },
  { header: '邮箱', dataIndex: 'email' },
  { header: '公司', dataIndex: 'company' },
  { header: '职位', dataIndex: 'jobTitle' },
  { header: '电话', dataIndex: 'phone' },
  { header: '留言', dataIndex: 'message' },
  { header: '癌种', dataIndex: 'cancerType' },
  { header: '药物类型', dataIndex: 'drugModality' },
  { header: '研究类型', dataIndex: 'studyType' },
  { header: '化合物数量', dataIndex: 'numCompounds' },
  { header: '交付时间', dataIndex: 'turnaround' },
  {
    header: '提交时间',
    accessor: (r) => dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss'),
  },
];

const LEADS_PAGE_SIZE = 20;

export default function AdminLeadsView() {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState<LeadSource | undefined>();
  const [status, setStatus] = useState<LeadStatus | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, refetch } = api.leads.adminList.useQuery({
    page,
    pageSize: LEADS_PAGE_SIZE,
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
      if (result.data) {
        await exportToXlsx({
          filename: 'leads',
          sheetName: '用户咨询',
          columns: LEAD_EXPORT_COLUMNS,
          rows: result.data as Lead[],
        });
      }
    } catch {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const columns: ColumnsType<Lead> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => (page - 1) * LEADS_PAGE_SIZE + idx + 1,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 90,
      render: (v: string) => (
        <Tag color={LEAD_SOURCE_TAG_COLORS[v as LeadSource]}>
          {LEAD_SOURCE_LABELS[v as LeadSource] ?? v}
        </Tag>
      ),
    },
    {
      title: '姓名',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
      width: 140,
    },
    {
      title: '公司',
      dataIndex: 'company',
      ellipsis: { showTitle: false },
      render: (v: string | null) => <EllipsisCell value={v} />,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => (
        <Badge
          color={LEAD_STATUS_BADGE_COLORS[v as LeadStatus]}
          text={LEAD_STATUS_LABELS[v as LeadStatus] ?? v}
        />
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
            options={toSelectOptions(LEAD_SOURCES, LEAD_SOURCE_LABELS)}
            placeholder="来源"
            style={{ width: 120 }}
          />
          <Select
            allowClear
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={toSelectOptions(LEAD_STATUSES, LEAD_STATUS_LABELS)}
            placeholder="状态"
            style={{ width: 120 }}
          />
        </Space>
        <Space>
          <Text type="secondary">共 {data?.total ?? 0} 条</Text>
          <Button loading={exporting} onClick={handleExport}>
            导出 Excel
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: LEADS_PAGE_SIZE,
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
              onChange={(v: LeadStatus) =>
                updateStatus.mutate({ id: selected.id, status: v })
              }
              options={toSelectOptions(LEAD_STATUSES, LEAD_STATUS_LABELS)}
              style={{ width: 120 }}
              value={selected.status}
            />
          )
        }
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ wrapper: { width: 560 } }}
        title={
          selected ? `${selected.firstName} ${selected.lastName}` : '线索详情'
        }
      >
        {selected && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="来源">
              <Tag
                color={LEAD_SOURCE_TAG_COLORS[selected.source as LeadSource]}
              >
                {LEAD_SOURCE_LABELS[selected.source as LeadSource] ??
                  selected.source}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                color={LEAD_STATUS_BADGE_COLORS[selected.status as LeadStatus]}
                text={
                  LEAD_STATUS_LABELS[selected.status as LeadStatus] ??
                  selected.status
                }
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
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
