import React from 'react';

interface Props {
  currentLevel: number;
  onSelect: (level: number) => void;
  unlockedLevels: number[];
}

const Sidebar: React.FC<Props> = ({ currentLevel, onSelect, unlockedLevels }) => {
  const visibleLevels = 2;
  
  return (
    <div className="w-48 border-r border-gray-200">
      {Array.from({ length: visibleLevels }, (_, i) => {
        const level = i + 1;
        const isUnlocked = unlockedLevels.includes(level);
        return (
          <button
            key={level}
            className={`w-full text-left px-4 py-2 ${
              level === currentLevel ? 'bg-teal-700 text-white' : ''
            } ${!isUnlocked ? 'cursor-not-allowed text-gray-400' : 'hover:bg-teal-100'}`}
            onClick={() => isUnlocked && onSelect(level)}
            disabled={!isUnlocked}
          >
            Level {level}
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;