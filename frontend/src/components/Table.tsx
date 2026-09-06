import { InboxIllustration } from "./icons";

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  key: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyHint?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  emptyMessage = "No records found.",
  emptyHint,
}: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-md shadow-glass">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-zinc-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                     <td key={col.key} className="px-4 py-3.5">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <InboxIllustration className="h-16 w-16 text-zinc-700" />
                    <div className="text-sm font-medium text-zinc-300">{emptyMessage}</div>
                    {emptyHint && <div className="max-w-xs text-xs text-zinc-500">{emptyHint}</div>}
                  </div>
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((row) => (
                <tr key={rowKey(row)} className="transition-colors hover:bg-zinc-800/40">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-zinc-300">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
