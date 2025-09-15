import { useState, useEffect } from 'react';
import type { SortOption } from '@/features/golfCourses/domain/types';
import { XIcon } from '@/shared/components/icons';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
  RadioGroup,
  RadioGroupItem,
} from '@/shared/components/ui';

interface SortModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'teeTime', label: '티타임 시간순' },
  { key: 'default', label: '그린피 가격순' },
  { key: 'name', label: '가나다순' },
];

const SortModal = ({ isOpen, onOpenChange }: SortModalProps) => {
  const initialSortOption = useGolfStore((state: GolfState) => state.sortOption);
  const applySort = useGolfStore((state: GolfState) => state.applySort);
  const resetSort = useGolfStore((state: GolfState) => state.resetSort);

  const [selectedOption, setSelectedOption] = useState<SortOption>(initialSortOption);

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(initialSortOption);
    }
  }, [initialSortOption, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleApply = () => {
    applySort(selectedOption);
  };

  const handleReset = () => {
    resetSort();
    setSelectedOption('default');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>검색 정렬 설정</SheetTitle>
          <SheetClose>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 -mr-2">
              <XIcon className="w-6 h-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="p-4">
          <RadioGroup
            value={selectedOption}
            onValueChange={(value) => setSelectedOption(value as SortOption)}
          >
            {sortOptions.map(({ key, label }) => (
              <RadioGroupItem key={key} value={key}>
                {label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>

        <SheetFooter>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            초기화
          </Button>
          <Button onClick={handleApply} className="flex-1">
            조건 설정완료
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SortModal;
