'use client';

import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Badge,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  message,
  Space,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { DraggableTable } from '@/components/DraggableTable';
import { EllipsisCell } from '@/components/EllipsisCell';
import { RichTextEditor } from '@/components/RichTextEditor';
import { api, type RouterOutputs } from '@/lib/trpc/react';

type Category = RouterOutputs['faq']['adminListCategories'][number];
type FaqItem = RouterOutputs['faq']['adminListItems'][number];

// ──────────────────────────────────────────────
// 左侧可拖拽分类列表
// ──────────────────────────────────────────────

function CategoryRow({
  cat,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  cat: Category;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(cat.id) });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging
      ? {
          zIndex: 9999,
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        }
      : {}),
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: 列表项内嵌 antd <Button>（编辑/删除），不能用原生 <button>，否则形成 button 嵌套
    <div
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      ref={setNodeRef}
      role="button"
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 8px 8px 6px',
        borderRadius: 8,
        cursor: 'pointer',
        background: selected ? '#e6f4ff' : 'transparent',
        color: selected ? '#1677ff' : '#333',
        marginBottom: 2,
        transition: 'background 0.15s',
      }}
      tabIndex={0}
    >
      <HolderOutlined
        onClick={(e) => e.stopPropagation()}
        ref={setActivatorNodeRef as React.Ref<HTMLSpanElement>}
        style={{ color: '#bbb', fontSize: 14, cursor: 'grab', flexShrink: 0 }}
        {...(listeners as React.HTMLAttributes<HTMLSpanElement>)}
      />
      <span
        style={{
          flex: 1,
          fontSize: 14,
          fontWeight: selected ? 600 : 400,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {cat.name}
      </span>
      {!cat.isVisible && (
        <Tag
          bordered={false}
          color="default"
          style={{ fontSize: 11, margin: 0 }}
        >
          隐藏
        </Tag>
      )}
      <span style={{ display: 'flex', flexShrink: 0 }}>
        <Tooltip title="编辑">
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            size="small"
            type="text"
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            size="small"
            type="text"
          />
        </Tooltip>
      </span>
    </div>
  );
}

// ──────────────────────────────────────────────
// 右侧问题面板
// ──────────────────────────────────────────────

function ItemsPanel({ category }: { category: Category }) {
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [answerContent, setAnswerContent] = useState('');
  const [itemForm] = Form.useForm();

  const { data: items, refetch } = api.faq.adminListItems.useQuery({
    categoryId: category.id,
  });

  const createItem = api.faq.adminCreateItem.useMutation({
    onSuccess: () => {
      message.success('已添加');
      setItemModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });
  const updateItem = api.faq.adminUpdateItem.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setItemModalOpen(false);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });
  const deleteItem = api.faq.adminDeleteItem.useMutation({
    onSuccess: () => {
      message.success('已删除');
      void refetch();
    },
    onError: () => message.error('删除失败'),
  });
  const updateItemSort = api.faq.adminUpdateItemSort.useMutation({
    onError: () => message.error('排序保存失败'),
  });
  const toggleItemVisible = api.faq.adminToggleItemVisible.useMutation({
    onSuccess: () => void refetch(),
    onError: () => message.error('切换显示失败'),
  });

  const handleOrderChange = useCallback(
    (newRows: FaqItem[]) => {
      updateItemSort.mutate(
        newRows.map((r, i) => ({ id: r.id, sortOrder: i })),
      );
    },
    [updateItemSort],
  );

  const openCreateItem = () => {
    setEditingItem(null);
    setAnswerContent('');
    itemForm.resetFields();
    setItemModalOpen(true);
  };

  const openEditItem = (r: FaqItem) => {
    setEditingItem(r);
    setAnswerContent(r.answer);
    itemForm.setFieldsValue(r);
    setItemModalOpen(true);
  };

  const handleItemSubmit = (vals: Record<string, unknown>) => {
    const payload = { ...vals, answer: answerContent };
    if (editingItem) {
      updateItem.mutate({
        id: editingItem.id,
        categoryId: category.id,
        sortOrder: editingItem.sortOrder,
        isVisible: editingItem.isVisible,
        ...payload,
      } as Parameters<typeof updateItem.mutate>[0]);
    } else {
      createItem.mutate({
        categoryId: category.id,
        sortOrder: items?.length ?? 0,
        isVisible: true,
        ...payload,
      } as Parameters<typeof createItem.mutate>[0]);
    }
  };

  const itemColumns: ColumnsType<FaqItem> = [
    {
      title: '#',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: '问题',
      dataIndex: 'question',
      ellipsis: { showTitle: false },
      render: (v: string) => <EllipsisCell value={v} />,
    },
    {
      title: '显示',
      dataIndex: 'isVisible',
      width: 70,
      render: (v: boolean, r: FaqItem) => (
        <Switch
          checked={v}
          onChange={(checked) =>
            toggleItemVisible.mutate({ id: r.id, isVisible: checked })
          }
          size="small"
        />
      ),
    },
    {
      title: '操作',
      width: 110,
      render: (_, r) => (
        <Space>
          <Button onClick={() => openEditItem(r)} size="small" type="link">
            编辑
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: '确认删除该问题？',
                okType: 'danger',
                onOk: () => deleteItem.mutate({ id: r.id }),
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
    <>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Space size={10}>
          <span style={{ fontWeight: 600, fontSize: 18 }}>{category.name}</span>
          <Badge
            color={category.isVisible ? 'blue' : 'default'}
            count={items?.length ?? 0}
            showZero
            style={{
              backgroundColor: category.isVisible ? '#e6f4ff' : '#f0f0f0',
              color: '#555',
            }}
          />
          {!category.isVisible && <Tag color="default">分类已隐藏</Tag>}
        </Space>
        <Button icon={<PlusOutlined />} onClick={openCreateItem} type="primary">
          添加问题
        </Button>
      </div>

      <DraggableTable
        columns={itemColumns}
        dataSource={items ?? []}
        locale={{
          emptyText: <Empty description="该分类下还没有问题" />,
        }}
        onOrderChange={handleOrderChange}
        pagination={false}
        size="middle"
      />

      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setItemModalOpen(false)}
        open={itemModalOpen}
        title={editingItem ? '编辑 Q&A' : '添加 Q&A'}
        width={700}
      >
        <Form
          form={itemForm}
          layout="vertical"
          onFinish={handleItemSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="问题" name="question" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="答案" rules={[{ required: true }]}>
            <RichTextEditor
              defaultValue={answerContent}
              key={editingItem?.id ?? 'new'}
              onChange={setAnswerContent}
            />
          </Form.Item>
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={createItem.isPending || updateItem.isPending}
              type="primary"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

// ──────────────────────────────────────────────
// 主视图
// ──────────────────────────────────────────────

export default function AdminFaqView() {
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [catForm] = Form.useForm();

  const { data: categories, refetch } = api.faq.adminListCategories.useQuery();

  useEffect(() => {
    if (selectedCatId === null && categories && categories.length > 0) {
      setSelectedCatId(categories[0]?.id ?? null);
    }
  }, [categories, selectedCatId]);

  const selectedCat = categories?.find((c) => c.id === selectedCatId) ?? null;

  // 增删/新建分类时清空 localCats，避免拖拽后保留的旧数组覆盖最新服务端数据
  const createCat = api.faq.adminCreateCategory.useMutation({
    onSuccess: (row) => {
      message.success('已添加');
      setCatModalOpen(false);
      setLocalCats([]);
      void refetch();
      if (row) setSelectedCatId(row.id);
    },
    onError: () => message.error('操作失败'),
  });
  const updateCat = api.faq.adminUpdateCategory.useMutation({
    onSuccess: () => {
      message.success('已保存');
      setCatModalOpen(false);
      setLocalCats([]);
      void refetch();
    },
    onError: () => message.error('操作失败'),
  });
  const deleteCat = api.faq.adminDeleteCategory.useMutation({
    onSuccess: () => {
      message.success('已删除');
      setLocalCats([]);
      void refetch();
      setSelectedCatId(null);
    },
    onError: () => message.error('删除失败'),
  });

  const updateCatSort = api.faq.adminUpdateCategorySort.useMutation({
    onError: () => message.error('排序保存失败'),
  });

  const [localCats, setLocalCats] = useState<Category[]>([]);
  const cats = localCats.length > 0 ? localCats : (categories ?? []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  const handleCatDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const oldIndex = cats.findIndex(
        (c) => String(c.id) === String(active.id),
      );
      const newIndex = cats.findIndex((c) => String(c.id) === String(over.id));
      const newCats = arrayMove(cats, oldIndex, newIndex);
      setLocalCats(newCats);
      updateCatSort.mutate(newCats.map((c, i) => ({ id: c.id, sortOrder: i })));
    },
    [cats, updateCatSort],
  );

  const openCreateCat = () => {
    setEditingCat(null);
    catForm.resetFields();
    catForm.setFieldsValue({ isVisible: true });
    setCatModalOpen(true);
  };

  const openEditCat = (r: Category) => {
    setEditingCat(r);
    catForm.setFieldsValue(r);
    setCatModalOpen(true);
  };

  const handleCatSubmit = (vals: Record<string, unknown>) => {
    const payload = {
      ...vals,
      sortOrder: editingCat?.sortOrder ?? categories?.length ?? 0,
    };
    if (editingCat) {
      updateCat.mutate({ id: editingCat.id, ...payload } as Parameters<
        typeof updateCat.mutate
      >[0]);
    } else {
      createCat.mutate(payload as Parameters<typeof createCat.mutate>[0]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        background: '#f5f5f5',
      }}
    >
      {/* 左侧分类菜单 */}
      <div
        style={{
          width: 260,
          flexShrink: 0,
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
        }}
      >
        <div
          style={{
            padding: '16px 16px 12px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space size={6}>
            <span style={{ fontWeight: 600, fontSize: 14, color: '#1f1f1f' }}>
              FAQ 分类
            </span>
            <Tag bordered={false} style={{ margin: 0, color: '#666' }}>
              {cats.length}
            </Tag>
          </Space>
          <Tooltip title="添加分类">
            <Button
              icon={<PlusOutlined />}
              onClick={openCreateCat}
              size="small"
              type="primary"
            />
          </Tooltip>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleCatDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={cats.map((c) => String(c.id))}
              strategy={verticalListSortingStrategy}
            >
              {cats.map((cat) => (
                <CategoryRow
                  cat={cat}
                  key={cat.id}
                  onDelete={() =>
                    Modal.confirm({
                      title: '确认删除整个分类及其下所有问题？',
                      content: cat.name,
                      okType: 'danger',
                      onOk: () => deleteCat.mutate({ id: cat.id }),
                    })
                  }
                  onEdit={() => openEditCat(cat)}
                  onSelect={() => setSelectedCatId(cat.id)}
                  selected={selectedCatId === cat.id}
                />
              ))}
            </SortableContext>
          </DndContext>

          {cats.length === 0 && (
            <Empty
              description="暂无分类"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: 32 }}
            />
          )}
        </div>
      </div>

      {/* 右侧问题 Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {selectedCat ? (
          <Card
            bordered={false}
            style={{
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
            styles={{ body: { padding: 20 } }}
          >
            <ItemsPanel category={selectedCat} key={selectedCat.id} />
          </Card>
        ) : (
          <div style={{ color: '#999', marginTop: 60, textAlign: 'center' }}>
            <Empty description="请从左侧选择一个分类" />
          </div>
        )}
      </div>

      {/* 分类编辑 Modal */}
      <Modal
        destroyOnHidden
        footer={null}
        onCancel={() => setCatModalOpen(false)}
        open={catModalOpen}
        title={editingCat ? '编辑分类' : '添加分类'}
      >
        <Form
          form={catForm}
          layout="vertical"
          onFinish={handleCatSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item label="分类名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="显示" name="isVisible" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={createCat.isPending || updateCat.isPending}
              type="primary"
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
