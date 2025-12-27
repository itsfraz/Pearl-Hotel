import React from 'react';

const Skeleton = ({ className, height, width, variant = "text" }) => {
  const baseClasses = "animate-pulse bg-slate-200 rounded";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  return (
    <div 
      className={`skeleton ${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={{ height, width }}
    />
  );
};

export default Skeleton;
