import React, { useState } from 'react';
import { Island } from '../../features/projects/types';
import { JourneyCard } from './JourneyCard';
import { GlassCard } from '../common/GlassCard';
import { Icon } from '../ui/Icon';
import { cn } from '../../lib/utils/cn';

export interface JourneyIslandProps {
  island: Island;
  onTaskReorder: (islandId: string, taskId: string, newOrder: number) => void;
}

export function JourneyIsland({
  island,
  onTaskReorder
}: JourneyIslandProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const isDark = island.variant === 'dark';

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskReorder(island.id, draggedTask, targetIndex);
    }
    setDraggedTask(null);
  };

  return (
    <GlassCard variant={island.variant} className="p-6 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="text-right">
          <p className={cn('text-[11px] uppercase tracking-widest', isDark ? 'text-white/60' : 'text-gray-400')}>
            مرحله
          </p>
          <h3 className="text-sm font-semibold">{island.title}</h3>
        </div>
        <button
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center border transition-colors',
            isDark
              ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
              : 'border-gray-200 bg-white text-gray-700 hover:text-gray-900'
          )}
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {island.tasks.map((task, index) => (
          <div
            key={task.id}
            onDragOver={e => e.preventDefault()}
            onDrop={e => handleDrop(e, index)}
          >
            <JourneyCard
              task={task}
              isDragging={draggedTask === task.id}
              onDragStart={() => handleDragStart(task.id)}
              onDragEnd={handleDragEnd}
              variant={island.variant}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
