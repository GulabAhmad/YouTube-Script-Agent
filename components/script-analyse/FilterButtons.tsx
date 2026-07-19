import { IRootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';

interface FilterButton {
  label: string;
  value: string | null;
}

interface FilterButtonsProps {
  activeTab: string | null;
  setActiveTab: (value: string | null) => void;
  buttons: FilterButton[];
  isTabAccessible?: (tabValue: string) => boolean;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeTab, setActiveTab, buttons, isTabAccessible }) => {
  
  return (
    <div className="flex p-1 mb-6 space-x-1 overflow-x-auto bg-white border rounded-lg dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      {buttons.map((button) => {
        const isAccessible = isTabAccessible ? isTabAccessible(button.value || '') : true;
        
        return (
          <button 
            key={button.value || 'all'}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              activeTab === button.value 
                ? 'bg-blue-600 text-white' 
                : isAccessible
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  : 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50'
            }`}
            onClick={() => isAccessible && setActiveTab(button.value)}
            disabled={!isAccessible}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterButtons; 