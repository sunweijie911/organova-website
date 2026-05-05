'use client';

import { HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface RowContextValue {
  setActivatorNodeRef?: (el: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextValue>({});

function DragHandle() {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <HolderOutlined
      ref={setActivatorNodeRef as React.Ref<HTMLSpanElement>}
      style={{ cursor: 'grab', color: '#bbb', fontSize: 15 }}
      {...(listeners as React.HTMLAttributes<HTMLSpanElement>)}
    />
  );
}

interface DraggableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

function DraggableRow({ children, ...props }: DraggableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {children}
      </tr>
    </RowContext.Provider>
  );
}

type WithId = { id: number };

interface DraggableTableProps<T extends WithId>
  extends Omit<TableProps<T>, 'components'> {
  dataSource: T[];
  onOrderChange: (newOrder: T[]) => void;
}

export function DraggableTable<T extends WithId>({
  dataSource,
  columns,
  onOrderChange,
  ...rest
}: DraggableTableProps<T>) {
  const [rows, setRows] = useState<T[]>(dataSource);

  useEffect(() => {
    setRows(dataSource);
  }, [dataSource]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const oldIndex = rows.findIndex((r) => r.id === Number(active.id));
      const newIndex = rows.findIndex((r) => r.id === Number(over.id));
      const newRows = arrayMove(rows, oldIndex, newIndex);
      setRows(newRows);
      onOrderChange(newRows);
    },
    [rows, onOrderChange],
  );

  const dragHandleColumn = {
    key: 'dragHandle',
    width: 40,
    title: '',
    render: () => <DragHandle />,
    align: 'center' as const,
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={rows.map((r) => String(r.id))}
        strategy={verticalListSortingStrategy}
      >
        <Table
          {...rest}
          columns={[dragHandleColumn, ...(columns ?? [])]}
          components={{ body: { row: DraggableRow } }}
          dataSource={rows}
          rowKey={(r) => String(r.id)}
        />
      </SortableContext>
    </DndContext>
  );
}
