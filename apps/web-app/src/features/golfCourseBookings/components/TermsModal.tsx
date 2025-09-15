import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui';
import { useGolfStore } from '@/shared/store/createStore';
import ReactMarkdown from 'react-markdown';

interface TermsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const TermsModal = ({ isOpen, onOpenChange }: TermsModalProps) => {
  const viewingTerms = useGolfStore((state) => state.viewingTerms);

  if (!isOpen || !viewingTerms) {
    return null;
  }

  const termsContent = {
    cancellation: {
      title: '취소 및 위약 약관',
      content: `
### 취소 및 위약 약관
`,
    },
    privacy: {
      title: '개인정보 제공 약관',
      content: `
### 개인정보 제공 약관
`,
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-full max-w-full! rounded-none! shadow-none!">
        <DialogHeader className="text-left">
          <DialogTitle>{termsContent[viewingTerms].title}</DialogTitle>
        </DialogHeader>
        <div className="h-11/12 overflow-y-auto">
          <div className="p-4 markdown">
            <ReactMarkdown>{termsContent[viewingTerms].content}</ReactMarkdown>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
