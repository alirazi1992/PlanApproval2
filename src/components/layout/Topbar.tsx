import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useWorkspace } from "../../features/workspace/WorkspaceContext";
import { workspaceTabs } from "../../features/workspace/data";
import { Icon } from "../ui/Icon";
import { Dropdown } from "../ui/Dropdown";
import { cn } from "../../lib/utils/cn";

export function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab } = useWorkspace();
  const currentTab = workspaceTabs.find((tab) => tab.id === activeTab);

  const userMenuItems = [
    {
      id: "profile",
      label: "پروفایل",
      icon: <Icon name="user" size={16} />,
      onClick: () => navigate("/settings/profile"),
    },
    {
      id: "settings",
      label: "امنیت و تنظیمات",
      icon: <Icon name="settings" size={16} />,
      onClick: () => navigate("/settings/security"),
    },
    {
      id: "logout",
      label: "خروج",
      icon: <Icon name="logout" size={16} />,
      onClick: () => {
        logout();
        navigate("/login");
      },
    },
  ];

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl">
      <div className="px-4 md:px-6 lg:px-10 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              سامانه مدیریت جامع
            </p>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                مدارک و پرونده‌ها
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-6">
            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-2xl px-3 py-2 w-64 shadow-sm">
              <Icon name="search" size={18} className="text-gray-400" />
              <input
                type="search"
                placeholder="جستجوی پرونده‌ها، افراد و یادداشت‌ها"
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none mr-2"
              />
            </div>
            <button className="w-11 h-11 rounded-full bg-white shadow-lg border border-white/60 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
              <Icon name="bell" size={18} />
            </button>
            <button className="w-11 h-11 rounded-full bg-white shadow-lg border border-white/60 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors">
              <Icon name="share" size={18} />
            </button>
            <Dropdown
              trigger={
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full cursor-pointer border-2 border-white shadow-lg object-cover"
                />
              }
              items={userMenuItems}
              align="left"
              offsetX={-16}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 justify-start">
            {workspaceTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "min-w-[160px] rounded-3xl px-4 py-3 text-right transition-all duration-200 border backdrop-blur",
                    "shadow-[0_15px_35px_rgba(15,23,42,0.08)]",
                    isActive
                      ? "bg-gray-900 text-white border-gray-900"
                      : cn(
                          "bg-white/80 text-gray-700 border-white",
                          "hover:bg-white",
                          "bg-gradient-to-br",
                          tab.accent
                        )
                  )}
                >
                  <div className="text-sm font-semibold">{tab.label}</div>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-gray-200" : "text-gray-500"
                    )}
                  >
                    {tab.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
