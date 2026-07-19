"use client"
import React, { useEffect } from 'react'
import MainComponent from '@/components/script-analyse/mainComponent'

const Page = () => {
  useEffect(() => {
    // Set the active tab to "NewTab" when the page loads
    const setActiveTab = (tab: string) => {
      // This will be handled by the MainComponent
      console.log('Setting active tab to:', tab);
    };
    
    setActiveTab("NewTab");
  }, []);

  return (
    <div>
      <MainComponent />
    </div>
  )
}

export default Page
