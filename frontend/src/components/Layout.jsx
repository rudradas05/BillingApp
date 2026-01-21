import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/60 dark:bg-neutral-800/60 rounded-2xl p-8 shadow border border-neutral-200 dark:border-neutral-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
