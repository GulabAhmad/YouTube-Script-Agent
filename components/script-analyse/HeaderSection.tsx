import React from 'react';

interface HeaderButton {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface HeaderSectionProps {
  title: string;
  description: string;
  buttons: HeaderButton[];
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, description, buttons }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">{description}</p>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg w-full sm:w-auto ${
              button.variant === 'primary'
                ? 'text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderSection; 