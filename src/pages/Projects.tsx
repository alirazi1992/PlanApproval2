import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/common/GlassCard';
import { mockProjects } from '../mocks/db';
import { Project } from '../features/projects/types';
import { cn } from '../lib/utils/cn';

type StatusFilter = 'all' | 'active' | 'pending' | 'completed';

export function Projects() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const numberFormatter = useMemo(() => new Intl.NumberFormat('fa-IR'), []);
  const formatNumber = (value: number) => numberFormatter.format(value);
  const statusLabels: Record<Project['status'], string> = {
    active: 'فعال',
    pending: 'در انتظار',
    completed: 'تکمیل‌شده'
  };

  const columns = [
    {
      key: 'name',
      header: 'نام پروژه',
      render: (project: Project) => (
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="text-right font-medium text-gray-900 hover:text-gray-600 transition-colors w-full"
        >
          {project.name}
        </button>
      )
    },
    {
      key: 'status',
      header: 'وضعیت',
      render: (project: Project) => (
        <Badge
          variant={
            project.status === 'completed'
              ? 'success'
              : project.status === 'active'
              ? 'default'
              : 'warning'
          }
        >
          {statusLabels[project.status]}
        </Badge>
      )
    },
    {
      key: 'owner',
      header: 'مالک',
      render: (project: Project) => <span>{project.owner}</span>
    },
    {
      key: 'progress',
      header: 'پیشرفت',
      render: (project: Project) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">
            {formatNumber(project.progress)}%
          </span>
        </div>
      ),
      width: '200px'
    },
    {
      key: 'date',
      header: 'تاریخ',
      render: (project: Project) => <span>{project.date}</span>
    }
  ];

  const filteredProjects =
    filter === 'all'
      ? mockProjects
      : mockProjects.filter(project => project.status === filter);

  const summary = useMemo(
    () => ({
      total: mockProjects.length,
      active: mockProjects.filter(project => project.status === 'active').length,
      pending: mockProjects.filter(project => project.status === 'pending').length,
      completed: mockProjects.filter(project => project.status === 'completed')
        .length
    }),
    []
  );

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: `همه (${formatNumber(summary.total)})` },
    { id: 'active', label: `فعال (${formatNumber(summary.active)})` },
    { id: 'pending', label: `در انتظار (${formatNumber(summary.pending)})` },
    { id: 'completed', label: `تکمیل‌شده (${formatNumber(summary.completed)})` }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <GlassCard className="p-6 space-y-6 text-right">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                پرتفوی
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">پروژه‌ها</h1>
              <p className="text-sm text-gray-500">
                وضعیت برنامه‌های تحویل را در تمام تیم‌ها رصد کنید.
              </p>
            </div>
            <Button variant="primary">پروژه جدید</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-right">
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                پروژه‌های فعال
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(summary.active)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                در انتظار
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(summary.pending)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                تکمیل‌شده
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatNumber(summary.completed)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {filters.map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  'px-4 py-2 rounded-2xl text-sm font-medium transition-all border',
                  filter === item.id
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                    : 'bg-white text-gray-600 border-white hover:text-gray-900'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-0">
          <Table data={filteredProjects} columns={columns} className="p-4" />
        </GlassCard>
      </div>
    </AppShell>
  );
}
