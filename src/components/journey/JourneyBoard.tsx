import React from 'react';
import { Island } from '../../features/projects/types';
import { JourneyIsland } from './JourneyIsland';
import { cn } from '../../lib/utils/cn';

export interface JourneyBoardProps {
  islands: Island[];
  onTaskReorder: (islandId: string, taskId: string, newOrder: number) => void;
  className?: string;
}

export function JourneyBoard({
  islands,
  onTaskReorder,
  className
}: JourneyBoardProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {islands.map((island, index) => (
          <div key={island.id} className="relative">
            <JourneyIsland island={island} onTaskReorder={onTaskReorder} />
            {index < islands.length - 1 && (
              <div className="absolute top-1/2 -right-3 flex items-center gap-2 translate-y-[-50%]">
                <span className="w-3 h-3 rounded-full border border-gray-200 bg-white shadow-inner" />
                <span className="w-12 h-[2px] rounded-full bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
