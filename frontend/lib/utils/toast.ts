import toast from 'react-hot-toast';

/**
 * Custom toast utility with India-inspired styling for Bharat Link
 */

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#f0fdf4',
                color: '#166534',
                border: '2px solid #22c55e',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            },
            icon: '✅',
        });
    },

    error: (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '2px solid #ef4444',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            },
            icon: '❌',
        });
    },

    info: (message: string) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#eff6ff',
                color: '#1e40af',
                border: '2px solid #3b82f6',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            },
            icon: 'ℹ️',
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#fff7ed',
                color: '#9a3412',
                border: '2px solid #ff6b35',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            },
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                position: 'top-right',
                style: {
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                },
            }
        );
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },
};
