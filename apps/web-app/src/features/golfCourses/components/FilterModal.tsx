import React, { useState, useEffect } from 'react';
import type { Filters } from '@/features/golfCourses/domain/types';
import {
  XIcon,
  LocationPinIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  CreditCardIcon,
} from '@/shared/components/icons';
import { useGolfStore, type GolfState } from '@/shared/store/createStore';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from '@/shared/components/ui';

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const filterOptions = {
  regions: ['서울 / 경기', '강원', '충청', '경상', '전라', '제주'],
  teeTimes: ['새벽 ~7시', '오전 7-12시', '오후 12-16시', '야간 16~'],
  greenFees: ['~5만원', '5~10만원', '10~15만원', '15만원~'],
  players: [3, 4],
  paymentMethods: ['현장결제', '선결제', '예약금결제'],
};

const FilterModal = ({ isOpen, onOpenChange }: FilterModalProps) => {
  const initialFilters = useGolfStore((state: GolfState) => state.filters);
  const applyFilters = useGolfStore((state: GolfState) => state.applyFilters);
  const resetFilters = useGolfStore((state: GolfState) => state.resetFilters);

  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [initialFilters, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleToggle = (category: keyof Filters, value: string | number) => {
    setFilters((prev) => {
      const currentValues = prev[category] as (string | number)[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleApply = () => {
    applyFilters(filters);
  };

  const handleReset = () => {
    const emptyFilters: Filters = {
      regions: [],
      teeTimes: [],
      greenFees: [],
      players: [],
      paymentMethods: [],
    };
    setFilters(emptyFilters);
    resetFilters();
  };

  const isSelected = (category: keyof Filters, value: string | number) => {
    return (filters[category] as (string | number)[]).includes(value);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>검색 조건 설정</SheetTitle>
          <SheetClose>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800 -mr-2">
              <XIcon className="w-6 h-6" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="p-4 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
          <FilterSection title="지역" icon={<LocationPinIcon className="w-5 h-5 text-gray-500" />}>
            {filterOptions.regions.map((option) => (
              <FilterButton
                key={option}
                label={option}
                isSelected={isSelected('regions', option)}
                onClick={() => handleToggle('regions', option)}
              />
            ))}
          </FilterSection>

          <FilterSection title="티타임" icon={<ClockIcon className="w-5 h-5 text-gray-500" />}>
            {filterOptions.teeTimes.map((option) => (
              <FilterButton
                key={option}
                label={option}
                isSelected={isSelected('teeTimes', option)}
                onClick={() => handleToggle('teeTimes', option)}
              />
            ))}
          </FilterSection>

          <FilterSection title="그린피" icon={<TagIcon className="w-5 h-5 text-gray-500" />}>
            {filterOptions.greenFees.map((option) => (
              <FilterButton
                key={option}
                label={option}
                isSelected={isSelected('greenFees', option)}
                onClick={() => handleToggle('greenFees', option)}
              />
            ))}
          </FilterSection>

          <div className="hidden">
            <FilterSection title="내장인원" icon={<UsersIcon className="w-5 h-5 text-gray-500" />}>
              {filterOptions.players.map((option) => (
                <FilterButton
                  key={option}
                  label={`${option}인`}
                  isSelected={isSelected('players', option)}
                  onClick={() => handleToggle('players', option)}
                />
              ))}
            </FilterSection>

            <FilterSection
              title="결제방식"
              icon={<CreditCardIcon className="w-5 h-5 text-gray-500" />}
            >
              {filterOptions.paymentMethods.map((option) => (
                <FilterButton
                  key={option}
                  label={option}
                  isSelected={isSelected('paymentMethods', option)}
                  onClick={() => handleToggle('paymentMethods', option)}
                />
              ))}
            </FilterSection>
          </div>
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

const FilterSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="font-bold ml-2 text-gray-800">{title}</h3>
    </div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const FilterButton = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Button
    onClick={onClick}
    variant="toggle"
    data-state={isSelected ? 'on' : 'off'}
    className="px-4 py-2 rounded-full border text-sm"
  >
    {label}
  </Button>
);

export default FilterModal;
