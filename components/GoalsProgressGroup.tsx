'use client';
import React from 'react';
import GoalsProgress from '@/components/GoalsProgress';
import IconTag from '@/components/icon/icon-tag';
import IconInbox from '@/components/icon/icon-inbox';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconBolt from '@/components/icon/icon-bolt';

interface GoalsProgressGroupProps {
    title?: string;
}

const GoalsProgressGroup = ({ title = 'Performance Summary' }: GoalsProgressGroupProps) => {
    const goalsData = [
        {
            id: 1,
            icon: <IconInbox />,
            title: 'Sessions Delivered',
            current: 60,
            target: 75,
            percentChange: 5,
            colorFrom: '#7579ff',
            colorTo: '#b224ef'
        },
        {
            id: 2,
            icon: <IconTag />,
            title: 'Training Completion',
            current: 515,
            target: 750,
            percentChange: 8,
            colorFrom: '#3cba92',
            colorTo: '#0ba360'
        },
        {
            id: 3,
            icon: <IconCreditCard />,
            title: 'Goals Achieved',
            current: 85,
            target: 100,
            percentChange: 12,
            colorFrom: '#f09819',
            colorTo: '#ff5858'
        },
        {
            id: 4,
            icon: <IconBolt />,
            title: 'Engagement Score',
            current: 75,
            target: 100,
            percentChange: -3,
            colorFrom: '#4361ee',
            colorTo: '#160f6b'
        }
    ];

    return (
        <div className="panel">
            <h5 className="mb-5 text-lg font-semibold dark:text-white-light">{title}</h5>
            <div className="space-y-9">
                {goalsData.map(goal => (
                    <GoalsProgress
                        key={goal.id}
                        icon={goal.icon}
                        title={goal.title}
                        current={goal.current}
                        target={goal.target}
                        percentChange={goal.percentChange}
                        colorFrom={goal.colorFrom}
                        colorTo={goal.colorTo}
                    />
                ))}
            </div>
        </div>
    );
};

export default GoalsProgressGroup; 