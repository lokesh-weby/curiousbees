import React from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * SectionHeader renders a title and optional subtitle using the project's design tokens.
 * It uses the `.cb-section-title` utility for the title and `.text-muted-custom` for subtitle.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`mb-6 ${className || ''}`}>
      <h1 className="cb-section-title">{title}</h1>
      {subtitle && (
        <p className="text-muted-custom mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeader;
