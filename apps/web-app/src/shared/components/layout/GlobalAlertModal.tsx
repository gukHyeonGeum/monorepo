import useAlertStore from '@/shared/store/alertStore';
import AlertModal from '@/shared/components/AlertModal';
import { useEffect, useState } from 'react';

/**
 * 전역 상태를 구독하여 AlertModal을 렌더링하는 컴포넌트입니다.
 * 이 컴포넌트는 앱의 최상단에 한 번만 렌더링되어야 합니다.
 */
const GlobalAlertModal = () => {
  const { isOpen, options, hideAlert } = useAlertStore();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClose = () => {
    if (isConfirming) return;
    options.onCancel?.();
    hideAlert();
  };
  const handleConfirm = async () => {
    if (options.onConfirm) {
      setIsConfirming(true);
      try {
        await options.onConfirm();
        hideAlert();
      } catch (error) {
        console.error('Alert confirmation action failed:', error);
      } finally {
        setIsConfirming(false);
      }
    } else {
      hideAlert();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setIsConfirming(false);
    }
  }, [isOpen]);

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={handleClose}
      onAction={handleConfirm}
      title={options.title}
      message={options.message}
      cancelText={options.cancelText}
      confirmText={options.confirmText}
      isConfirming={isConfirming}
    />
  );
};

export default GlobalAlertModal;
