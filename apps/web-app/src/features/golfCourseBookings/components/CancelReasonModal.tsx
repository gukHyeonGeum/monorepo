import { useState } from 'react';
import { CheckIcon } from '@/shared/components/icons';
import { useGolfStore } from '@/shared/store/createStore';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui';

interface CancelReasonModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const reasons = ['단순 변심', '일정 변경', '가격 불만족', '기상악화', '예약 변경', '기타'];

const CancelReasonModal = ({ isOpen, onOpenChange }: CancelReasonModalProps) => {
  const { selectCancellationReason } = useGolfStore.getState();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSelect = () => {
    if (selectedReason) {
      selectCancellationReason();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="text-left">
          <DialogTitle>취소 사유 선택</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-3">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className="w-full flex items-center text-left p-3 rounded-lg hover:bg-gray-50"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 mr-3
                ${selectedReason === reason ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}
              >
                {selectedReason === reason && <CheckIcon className="w-4 h-4 text-white" />}
              </div>
              <span>{reason}</span>
            </button>
          ))}
        </div>

        <div className="p-6 pt-2">
          <Button className="w-full" onClick={handleSelect} disabled={!selectedReason}>
            선택하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelReasonModal;
