import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { GlassCard } from '../components/common/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';

export function SettingsSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-right">
          تنظیمات امنیتی
        </h1>

        <GlassCard className="p-6 space-y-4 text-right">
          <h2 className="text-lg font-semibold text-gray-900">
            تغییر رمز عبور
          </h2>
          <Input label="رمز فعلی" type="password" />
          <Input label="رمز جدید" type="password" />
          <Input label="تأیید رمز جدید" type="password" />
          <Button variant="primary">به‌روزرسانی رمز</Button>
        </GlassCard>

        <GlassCard className="p-6 space-y-4 text-right">
          <h2 className="text-lg font-semibold text-gray-900">
            احراز هویت دو مرحله‌ای
          </h2>
          <p className="text-sm text-gray-600">
            با فعال‌سازی این گزینه، ورود به حساب تنها با وارد کردن کد
            امنیتی از اپلیکیشن احراز هویت امکان‌پذیر است.
          </p>
          <Switch
            checked={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
            label="فعال‌سازی احراز دو مرحله‌ای"
          />
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-900">
              احراز دو مرحله‌ای فعال شد. از این پس هنگام ورود، باید کد
              تولیدشده در اپلیکیشن احراز هویت را وارد کنید.
            </div>
          )}
        </GlassCard>
      </div>
    </AppShell>
  );
}
