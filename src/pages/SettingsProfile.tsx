import React, { useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { GlassCard } from '../components/common/GlassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { useAuth } from '../features/auth/AuthContext';

export function SettingsProfile() {
  const { user } = useAuth();
  const [isRTL, setIsRTL] = useState(true);
  const [language, setLanguage] = useState('fa');

  const handleRTLToggle = (checked: boolean) => {
    setIsRTL(checked);
    document.documentElement.dir = checked ? 'rtl' : 'ltr';
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 text-right">
          تنظیمات پروفایل
        </h1>

        <GlassCard className="p-6 text-right">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            اطلاعات فردی
          </h2>
          <div className="space-y-4">
            <Input label="نام" defaultValue={user?.name} />
            <Input label="ایمیل" type="email" defaultValue={user?.email} />
            <Button variant="primary">ذخیره تغییرات</Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6 text-right">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            زبان و جهت نمایش
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زبان
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="fa">فارسی (fa-IR)</option>
                <option value="en">انگلیسی (en-US)</option>
              </select>
            </div>
            <Switch
              checked={isRTL}
              onChange={handleRTLToggle}
              label="فعالسازی نمایش راست‌به‌چپ"
            />
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
