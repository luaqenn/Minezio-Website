import React, { createContext, useContext } from 'react';

const WidgetHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`p-4 border-b border-white/10 dark:border-gray-700/50 ${className}`}>
      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 text-center sm:text-left">
        {children}
      </h3>
    </div>
  );
};

const WidgetBody = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
};


interface WidgetComposition {
  Header: typeof WidgetHeader;
  Body: typeof WidgetBody;
}

const Widget: React.FC<{ children: React.ReactNode; className?: string }> & WidgetComposition = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg 
                  border border-white/10 dark:border-gray-700/50 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

Widget.Header = WidgetHeader;
Widget.Body = WidgetBody;

export default Widget;