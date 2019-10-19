import React from 'react';

function PageContainer({ children }) {
  return (
    <div style={{ padding: '20px', minHeight: 'calc(100vh - 56px)' }}>
      {children}
    </div>
  );
}

export default PageContainer;
