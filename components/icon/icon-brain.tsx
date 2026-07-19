import React from 'react';

interface IconProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const IconBrain = ({ className = '', fill = false, duotone = true }: IconProps) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"></path>
            <path d="M14.5,2a2.5,2.5,0,1,0,0,5,2.5,2.5,0,0,0,0-5z"></path>
            <path d="M17.5,10.5a2.5,2.5,0,1,0,0,5,2.5,2.5,0,0,0,0-5z"></path>
            <path d="M6.5,10.5a2.5,2.5,0,1,1,0,5,2.5,2.5,0,0,1,0-5z"></path>
            <path d="M12,12a2.5,2.5,0,1,0,0,5,2.5,2.5,0,0,0,0-5z"></path>
            <path d="M7,19a2,2,0,1,1,0,4,2,2,0,0,1,0-4z"></path>
            <path d="M17,19a2,2,0,1,0,0,4,2,2,0,0,0,0-4z"></path>
            <path d="M12,15v5"></path>
            <path d="M7,13v6"></path>
            <path d="M17,13v6"></path>
            <path d="M12,7v5"></path>
            <path d="M7,5v5.5"></path>
            <path d="M17,5v5.5"></path>
            <path d="M10,7h4"></path>
        </svg>
    );
};

export default IconBrain; 