import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Objection {
  id: string;
  customerName: string;
  product: string;
  objectionRaised: string;
  status: 'Scheduled' | 'Ongoing' | 'Completed';
  result: 'Won' | 'Lost' | '-';
}
interface CallData {
  transcript?: string;
  target_audience?: string;
  key_features_discussed?: string[];
  call_settings?: {
    duration: number;
    warmupTime: number;
    maxAttempts: number;
  };
  duration?: number;
  notes?: string;
  outcome?: string;
  metadata?: {
    call_quality: string;
    customer_satisfaction: number;
  };
}

interface Call {
  id: number;
  product_id: number;
  user_id: number;
  call_type: string;
  agent_name: string;
  call_data: CallData;
  created_at: string;
  product_name: string;
}

interface TabProps {
  calls: Call[];
  userProductPersonas: any;
}

const ObjectionHandling = ({ calls, userProductPersonas }: TabProps) => {
  console.log(userProductPersonas, 'userProductPersonas');
  // State for filter values
  const [dateFilter, setDateFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [objectionTypeFilter, setObjectionTypeFilter] = useState('');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);

  const openTranscriptModal = (call: Call) => {
    setSelectedCall(call);
    setIsTranscriptModalOpen(true);
  };

  // Filter calls based on selected date and agent
  const filteredCalls = useMemo(() => {
    let filtered = calls;

    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);

      filtered = filtered.filter(call => {
        const callDate = new Date(call.created_at);
        switch (dateFilter) {
          case 'today':
            return callDate >= today;
          case 'yesterday':
            return callDate >= yesterday && callDate < today;
          case 'last7days':
            return callDate >= last7Days;
          case 'last30days':
            return callDate >= last30Days;
          default:
            return true;
        }
      });
    }

    // Apply agent filter
    if (agentFilter) {
      filtered = filtered.filter(call => call.agent_name === agentFilter);
    }

    return filtered;
  }, [calls, dateFilter, agentFilter]);

  // Get the appropriate status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'badge-outline-secondary';
      case 'Ongoing': return 'badge-outline-warning';
      case 'Completed': return 'badge-outline-success';
      default: return 'badge-outline-info';
    }
  };

  // Get the appropriate result badge class
  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case 'Won': return 'badge-outline-success';
      case 'Lost': return 'badge-outline-danger';
      default: return 'badge-outline-secondary';
    }
  };

  // Get the appropriate action buttons based on status
  const getActionButtons = (status: string, call: Call) => {
    switch (status) {
      case 'Scheduled':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-primary">View Agenda</button>
          </>
        );
      case 'Ongoing':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-success">Join</button>
            <button type="button" className="btn btn-sm btn-outline-info">View</button>
          </>
        );
      case 'Completed':
        return (
          <>
            <button type="button" className="btn btn-sm btn-outline-info" onClick={() => openTranscriptModal(call)}>View</button>
          </>
        );
      default:
        return (
          <button type="button" className="btn btn-sm btn-outline-info" onClick={() => openTranscriptModal(call)}>View</button>
        );
    }
  };

  return (
    <div className="panel mt-5 overflow-hidden border-0 p-0">
     
    </div>
  );
};

export default ObjectionHandling;
