import React from 'react';
import { IonSpinner } from '@ionic/react';

// ==============================|| FULL PAGE BLUR LOADER ||============================== //

const CircularLoader: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.26)',
        backdropFilter: 'blur(1px)',
        zIndex: 9999
      }}
    >
      <IonSpinner name="lines-sharp" style={{ width: 120, height: 120, color: '#1976d2' }} />
    </div>
  );
};

export default CircularLoader;
