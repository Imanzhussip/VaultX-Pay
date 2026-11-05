import type { ReactNode } from 'react';

function PageHeader({ title, subline, actions }: { title: string; subline?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="text-[24px] font-bold leading-8 tracking-[-0.015em]">{title}</h1>
        {subline && <p className="mt-1 text-muted">{subline}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
