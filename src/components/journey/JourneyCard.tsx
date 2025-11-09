import React from 'react';
import { Task } from '../../features/projects/types';
import { Icon } from '../ui/Icon';
import { cn } from '../../lib/utils/cn';

export interface JourneyCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  variant?: 'light' | 'dark';
}

export function JourneyCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  variant = 'light'
}: JourneyCardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        'p-4 rounded-3xl border transition-all duration-200 cursor-move relative overflow-hidden group',
        isDark
          ? 'bg-white/5 border-white/20 text-white'
          : 'bg-white border-white/60 text-gray-900 shadow-[0_15px_40px_rgba(15,23,42,0.08)]',
        isDragging && 'opacity-60 scale-[0.98]'
      )}
    >
      <div className="flex items-start gap-3">
        <img
          src={task.avatar}
          alt=""
          className="w-10 h-10 rounded-2xl flex-shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0 text-right">
          <h4 className="text-sm font-semibold">{task.title}</h4>
          {task.subtitle && (
            <span
              className={cn(
                'inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium mt-1',
                isDark ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-gray-600'
              )}
            >
              {task.subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.hasCheck && (
            <span
              className={cn(
                'w-7 h-7 rounded-2xl flex items-center justify-center',
                isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              <Icon name="check" size={14} />
            </span>
          )}
          {task.hasCalendar && (
            <span
              className={cn(
                'w-7 h-7 rounded-2xl flex items-center justify-center',
                isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              <Icon name="calendar" size={14} />
            </span>
          )}
          {task.hasMenu && (
            <span
              className={cn(
                'w-7 h-7 rounded-2xl flex items-center justify-center',
                isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
              )}
            >
              <Icon name="menu" size={14} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
