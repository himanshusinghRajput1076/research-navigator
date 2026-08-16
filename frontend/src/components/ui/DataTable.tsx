import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T = any> {
  key?: string;
  header: string;
  accessor?: keyof T | string | ((row: T) => React.ReactNode);
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onSort?: (key: string) => void;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}

export function DataTable<T = any>({
  columns,
  data,
  loading,
  onSort,
  onRowClick,
  sortKey,
  sortDirection,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-800/80 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-900/50">
        No records found. Click add above to record new research data.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
          <tr>
            {columns.map((col, i) => {
              const sortField = col.key || (typeof col.accessor === 'string' ? col.accessor : undefined);
              return (
                <th
                  key={i}
                  className={cn(
                    'px-6 py-4 font-semibold text-slate-300 tracking-wider',
                    col.sortable && sortField && 'cursor-pointer hover:bg-slate-800/50'
                  )}
                  onClick={() => col.sortable && sortField && onSort?.(sortField)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortKey === sortField &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-indigo-400" />
                      ))}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((row, i) => (
            <tr
              key={i}
              className={cn(
                'hover:bg-slate-800/40 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col, j) => {
                let content: React.ReactNode = null;
                if (col.render) {
                  content = col.render(row);
                } else if (typeof col.accessor === 'function') {
                  content = col.accessor(row);
                } else if (typeof col.accessor === 'string') {
                  content = (row as any)[col.accessor];
                } else if (col.key) {
                  content = (row as any)[col.key];
                }
                return (
                  <td key={j} className="px-6 py-4">
                    {content !== undefined && content !== null ? content : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
