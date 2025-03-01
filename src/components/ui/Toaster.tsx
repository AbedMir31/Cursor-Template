'use client'

import { Toaster as HotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        className: '',
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
        },
        success: {
          style: {
            borderLeft: '4px solid #4ade80',
          },
          iconTheme: {
            primary: '#4ade80',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            borderLeft: '4px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  )
} 