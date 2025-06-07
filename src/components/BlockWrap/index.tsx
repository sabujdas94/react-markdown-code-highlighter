import React, { useContext, useEffect, useState, useMemo } from 'react';

// Example ThemeContext, replace with your actual context import if different
const ThemeContext = React.createContext<'light' | 'dark'>('light');

interface BlockWrapProps {
  children: React.ReactNode;
  language: string;
  theme: 'dark' | 'light'; // Optional theme prop
}

const BlockWrap: React.FC<BlockWrapProps> = ({ children, language, theme }) => {
  const [isDark, setIsDark] = useState('dark' == theme);

  const blockClass = useMemo(
    () => `md-code-block ${isDark ? 'md-code-block-dark' : 'md-code-block-light'}`,
    [isDark]
  );

  return (
    <div className={blockClass}>
      <div className="md-code-block-banner-wrap">
        <div className="md-code-block-banner md-code-block-banner-lite">
          <div className="md-code-block-banner-content">
            <div className="md-code-block-language">{language}</div>
            {/* <div className="md-code-block-copy">Copy</div> */}
          </div>
        </div>
      </div>
      <div className="md-code-block-content">{children}</div>
    </div>
  );
};

export default React.memo(BlockWrap);
