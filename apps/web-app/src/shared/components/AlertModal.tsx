import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/shared/components/ui';
import ReactMarkdown from 'react-markdown';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isConfirming?: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onAction,
  title,
  message,
  cancelText,
  confirmText = '확인',
  isConfirming = false,
}: AlertModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isConfirming && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-left"></AlertDialogDescription>
          <div className="markdown text-sm space-y-3 text-gray-600 py-4 text-left">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelText ? (
            <AlertDialogCancel
              className="flex-1"
              variant="secondary"
              onClick={onClose}
              disabled={isConfirming}
            >
              {cancelText}
            </AlertDialogCancel>
          ) : null}
          <AlertDialogAction
            className={`${cancelText ? 'flex-1' : 'w-full'}`}
            onClick={onAction}
            disabled={isConfirming}
          >
            {isConfirming ? '처리 중...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
