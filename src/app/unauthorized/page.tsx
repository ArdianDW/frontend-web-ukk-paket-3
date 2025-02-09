import React from 'react';
import { AlertCircle } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div style={styles.container}>
      <AlertCircle size={48} color="#FF0000" style={styles.icon} />
      <h1 style={styles.title}>403 - Akses Ditolak</h1>
      <p style={styles.message}>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '100vh',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  icon: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  message: {
    fontSize: '1.2rem',
  },
};

export default Unauthorized;
