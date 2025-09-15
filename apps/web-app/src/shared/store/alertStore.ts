import { create } from 'zustand';

interface AlertOptions {
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

interface AlertState {
  isOpen: boolean;
  options: AlertOptions;
  showAlert: (options: AlertOptions) => void;
  hideAlert: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  options: {
    title: '',
    message: '',
    cancelText: '취소',
    confirmText: '확인',
  },
  showAlert: (options) => set({ isOpen: true, options }),
  hideAlert: () => set((state) => ({ ...state, isOpen: false })),
}));

export const showAlert = (options: AlertOptions) => {
  useAlertStore.getState().showAlert(options);
};

export default useAlertStore;
