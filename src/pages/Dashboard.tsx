import React, { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { AvatarGroup } from "../components/common/AvatarGroup";
import { JourneyBoard } from "../components/journey/JourneyBoard";
import { GlassCard } from "../components/common/GlassCard";
import { Donut } from "../components/charts/Donut";
import { AreaSpark } from "../components/charts/AreaSpark";
import { Icon } from "../components/ui/Icon";
import { Button } from "../components/ui/Button";
import { mockAvatars } from "../mocks/db";
import { Island } from "../features/projects/types";
import { useWorkspace } from "../features/workspace/WorkspaceContext";
import {
  createInitialJourneyState,
  workspaceSnapshots,
} from "../features/workspace/data";
import { cn } from "../lib/utils/cn";

const knowledgeBase = [
  { id: "kb-1", title: "چک‌لیست ریشه‌یابی", score: "۹۵%" },
  { id: "kb-2", title: "الگوی ارتباط با مدیران", score: "۸۷%" },
  { id: "kb-3", title: "بسته آزمون و تأیید", score: "۷۶%" },
];

export function Dashboard() {
  const { activeTab } = useWorkspace();
  const [journeys, setJourneys] = useState(() => createInitialJourneyState());
  const snapshot = workspaceSnapshots[activeTab];
  const islands = journeys[activeTab];

  const handleTaskReorder = (
    islandId: string,
    taskId: string,
    newOrder: number
  ) => {
    setJourneys((prev) => {
      const next = { ...prev };
      next[activeTab] = prev[activeTab].map((island) => {
        if (island.id !== islandId) return island;
        const tasks = [...island.tasks];
        const fromIndex = tasks.findIndex((task) => task.id === taskId);
        if (fromIndex === -1) return island;
        const [removed] = tasks.splice(fromIndex, 1);
        tasks.splice(newOrder, 0, removed);
        return {
          ...island,
          tasks: tasks.map((task, order) => ({ ...task, order })),
        };
      });
      return next;
    });
  };

  const donutData = [
    { label: "تشدید شده", value: 18, color: "#f87171" },
    { label: "در جریان", value: 32, color: "#60a5fa" },
    { label: "حل‌شده", value: 44, color: "#34d399" },
  ];

  const sparkData = [30, 42, 38, 54, 49, 60, 70, 88, 85, 78, 90, 97];

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        <section className="grid gap-6 xl:grid-cols-[2.1fr,0.9fr]">
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    فضای کاری
                  </p>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    {snapshot.headline}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {snapshot.subline}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="glass" size="sm">
                    اشتراک برد
                  </Button>
                  <Button variant="primary" size="sm">
                    پرونده جدید
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 mt-6 sm:grid-cols-3">
                {snapshot.metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="rounded-2xl border border-white/70 bg-white/90 p-3 text-right"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-gray-400">
                      {metric.label}
                    </p>
                    <div className="flex items-end justify-end gap-2 mt-2">
                      <span className="text-2xl font-semibold text-gray-900">
                        {metric.value}
                      </span>
                      {metric.trend && (
                        <span
                          className={cn(
                            "text-xs font-medium flex items-center gap-1",
                            metric.trend.isPositive
                              ? "text-emerald-600"
                              : "text-rose-500"
                          )}
                        >
                          <Icon
                            name={
                              metric.trend.isPositive
                                ? "arrowUpRight"
                                : "arrowDownRight"
                            }
                            size={14}
                          />
                          {metric.trend.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    تیم فعال
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    جریان مالکیت پرونده
                  </h3>
                </div>
                <Button variant="secondary" size="sm">
                  دعوت
                </Button>
              </div>
              <AvatarGroup avatars={mockAvatars} className="mb-4" />
              <JourneyBoard
                islands={islands}
                onTaskReorder={handleTaskReorder}
              />
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6 text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                اولویت تمرکز
              </p>
              <h3 className="text-lg font-semibold mt-2 text-gray-900">
                {snapshot.priority}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                گلوگاه‌ها را در مسیر انتقال مدیریت کنید و قبل از جلسات اجرایی،
                زمان‌بندی‌ها را تثبیت کنید.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">
                  شروع وظیفه بعدی
                </Button>
                <Button variant="secondary" size="sm">
                  مشاهده بک‌لاگ
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-6 text-right">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    یادآورها
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    رویدادهای پیش‌رو
                  </h3>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  مشاهده همه
                </Button>
              </div>
              <div className="space-y-4">
                {snapshot.reminders.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2" />
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        مسئول: {item.owner} · موعد {item.due}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-right">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                سفر تیکت‌های پشتیبانی
              </h3>
              <span className="text-xs text-gray-500">۷ روز گذشته</span>
            </div>
            <div className="flex justify-center">
              <Donut data={donutData} size={200} />
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-right">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                روند حل مسئله
              </h3>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Icon name="arrowUpRight" size={14} />
                +۸.۴%
              </span>
            </div>
            <div className="flex justify-center items-center h-40">
              <AreaSpark
                data={sparkData}
                width={260}
                height={120}
                color="#6366f1"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-right">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                دانش پیشنهادی
              </h3>
              <Button variant="ghost" size="sm" className="text-gray-500">
                مشاهده اسناد
              </Button>
            </div>
            <div className="space-y-3">
              {knowledgeBase.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/90 px-4 py-3"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500">مرکز دانش</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {article.score}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          {["plus", "clipboard", "calendar"].map((icon) => (
            <button
              key={icon}
              className="w-14 h-14 rounded-3xl bg-white shadow-[0_20px_35px_rgba(15,23,42,0.12)] border border-white flex items-center justify-center text-gray-700 hover:scale-105 transition-transform"
            >
              <Icon name={icon} size={22} />
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
