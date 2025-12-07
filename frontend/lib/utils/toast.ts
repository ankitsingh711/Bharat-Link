import toast from 'react-hot-toast';

/**
 * Custom toast utility with beautiful, professional styling for Bharat Link
 */

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                color: '#166534',
                border: '1px solid #86efac',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.15), 0 8px 10px -6px rgba(34, 197, 94, 0.1)',
                backdropFilter: 'blur(10px)',
                minWidth: '300px',
            },
            iconTheme: {
                primary: '#22c55e',
                secondary: '#ffffff',
            },
        });
    },

    error: (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                color: '#991b1b',
                border: '1px solid #fca5a5',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.15), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                minWidth: '300px',
            },
            iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
            },
        });
    },

    info: (message: string) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                color: '#9a3412',
                border: '1px solid #fdba74',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(249, 115, 22, 0.15), 0 8px 10px -6px rgba(249, 115, 22, 0.1)',
                backdropFilter: 'blur(10px)',
                minWidth: '300px',
            },
            icon: '💡',
        });
    },

    loading: (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                color: '#374151',
                border: '1px solid #e5e7eb',
                padding: '16px 20px',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: '600',
                boxShadow: '0 20px 25px -5px rgba(107, 114, 128, 0.15), 0 8px 10px -6px rgba(107, 114, 128, 0.1)',
                backdropFilter: 'blur(10px)',
                minWidth: '300px',
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
                    padding: '16px 20px',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontWeight: '600',
                    boxShadow: '0 20px 25px -5px rgba(107, 114, 128, 0.15), 0 8px 10px -6px rgba(107, 114, 128, 0.1)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '300px',
                },
                success: {
                    style: {
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        color: '#166534',
                        border: '1px solid #86efac',
                    },
                    iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    style: {
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#991b1b',
                        border: '1px solid #fca5a5',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                },
            }
        );
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },
};
