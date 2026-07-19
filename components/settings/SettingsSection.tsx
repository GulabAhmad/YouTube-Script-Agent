import React from 'react';

interface SettingsSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const SettingsSection = ({ icon, title, children }: SettingsSectionProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-gray-600 dark:text-gray-300">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection; 