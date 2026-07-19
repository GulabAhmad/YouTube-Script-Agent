'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/themeConfigSlice';
import { IRootState } from '@/store';
import SettingsHeader from './SettingsHeader';
import SettingsSection from './SettingsSection';
import SettingsItem from './SettingsItem';

const Settings = () => {
  const dispatch = useDispatch();
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  
  const [settings, setSettings] = useState({
    personalInfo: true,
    changePassword: true,
    emailNotifications: true,
    practiceReminders: false,
    callRecording: true,
    dataSharing: true,
    microphone: true,
    soundEffects: false,
  });

  const handleToggle = (key: keyof typeof settings) => (enabled: boolean) => {
    setSettings(prev => ({ ...prev, [key]: enabled }));
  };

  const handleDarkModeToggle = (enabled: boolean) => {
    dispatch(toggleTheme(enabled ? 'dark' : 'light'));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <SettingsHeader />
      
      <SettingsSection
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
        title="Profile"
      >
        <SettingsItem
          title="Personal Information"
          description="Update your name, email, and profile details"
          enabled={settings.personalInfo}
          onToggle={handleToggle('personalInfo')}
        />
        <SettingsItem
          title="Change Password"
          description="Modify your account password"
          enabled={settings.changePassword}
          onToggle={handleToggle('changePassword')}
        />
      </SettingsSection>

      <SettingsSection
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        }
        title="Notifications"
      >
        <SettingsItem
          title="Email Notifications"
          description="Receive updates about your progress and new content"
          enabled={settings.emailNotifications}
          onToggle={handleToggle('emailNotifications')}
        />
        <SettingsItem
          title="Practice Reminders"
          description="Get reminded to practice regularly"
          enabled={settings.practiceReminders}
          onToggle={handleToggle('practiceReminders')}
        />
      </SettingsSection>

      <SettingsSection
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
        title="Privacy"
      >
        <SettingsItem
          title="Call Recording Storage"
          description="Manage how long your practice calls are stored"
          enabled={settings.callRecording}
          onToggle={handleToggle('callRecording')}
        />
        <SettingsItem
          title="Data Sharing"
          description="Control what data is shared with your team"
          enabled={settings.dataSharing}
          onToggle={handleToggle('dataSharing')}
        />
      </SettingsSection>

      <SettingsSection
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        }
        title="Appearance"
      >
        <SettingsItem
          title="Dark Mode"
          description="Toggle dark mode for the interface"
          enabled={themeConfig.theme === 'dark'}
          onToggle={handleDarkModeToggle}
        />
      </SettingsSection>

      <SettingsSection
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        }
        title="Audio"
      >
        <SettingsItem
          title="Microphone"
          description="Configure your microphone settings for calls"
          enabled={settings.microphone}
          onToggle={handleToggle('microphone')}
        />
        <SettingsItem
          title="Sound Effects"
          description="Enable or disable interface sound effects"
          enabled={settings.soundEffects}
          onToggle={handleToggle('soundEffects')}
        />
      </SettingsSection>
    </div>
  );
};

export default Settings; 