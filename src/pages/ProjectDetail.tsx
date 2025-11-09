import React from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/common/GlassCard';
import {
  mockProjects,
  mockDocuments,
  mockComments,
  mockMeetings
} from '../mocks/db';

export function ProjectDetail() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            پروژه‌ای با این شناسه یافت نشد
          </h2>
        </div>
      </AppShell>
    );
  }

  const statusLabels: Record<typeof project.status, string> = {
    active: 'فعال',
    pending: 'در انتظار',
    completed: 'تکمیل‌شده'
  };
  const numberFormatter = new Intl.NumberFormat('fa-IR');
  const formatNumber = (value: number) => numberFormatter.format(value);

  const tabs = [
    {
      id: 'documents',
      label: 'اسناد',
      content: (
        <div className="space-y-3">
          {mockDocuments.map(doc => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-sm"
            >
              <div className="text-right">
                <h4 className="font-medium text-gray-900">{doc.name}</h4>
                <p className="text-sm text-gray-500">
                  {doc.size} · بارگذاری توسط {doc.uploadedBy}
                </p>
              </div>
              <Badge>{doc.type}</Badge>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'comments',
      label: 'دیدگاه‌ها',
      content: (
        <div className="space-y-4">
          {mockComments.map(comment => (
            <div
              key={comment.id}
              className="flex gap-3 rounded-2xl border border-white/70 bg-white/90 p-4"
            >
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'meetings',
      label: 'جلسات',
      content: (
        <div className="space-y-3">
          {mockMeetings.map(meeting => (
            <div
              key={meeting.id}
              className="rounded-2xl border border-white/70 bg-white/90 p-4 text-right"
            >
              <h4 className="font-medium text-gray-900 mb-1">
                {meeting.title}
              </h4>
              <p className="text-sm text-gray-600">
                {meeting.date} · {meeting.time}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                حاضرین: {meeting.attendees.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'history',
      label: 'تاریخچه',
      content: (
        <div className="text-gray-600">
          تاریخچه پروژه به‌زودی در این بخش نمایش داده می‌شود.
        </div>
      )
    },
    {
      id: 'certificate',
      label: 'گواهی',
      content: (
        <div className="text-gray-600">
          گواهی یا تأییدیه پروژه پس از تکمیل در اینجا قابل دانلود خواهد بود.
        </div>
      )
    }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <GlassCard className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                جزئیات پروژه
              </p>
              <h1 className="text-2xl font-semibold text-gray-900">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500">
                مالک: {project.owner} · پیشرفت: {formatNumber(project.progress)}%
              </p>
            </div>
            <div className="flex items-center gap-3">
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
              <Button variant="secondary">صدور خلاصه</Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-right">
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                مالک
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {project.owner}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                پیشرفت
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(project.progress)}%
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                آخرین به‌روزرسانی
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {project.date}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <Tabs tabs={tabs} variant="pills" />
        </GlassCard>
      </div>
    </AppShell>
  );
}
