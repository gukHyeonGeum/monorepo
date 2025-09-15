import { FilterIcon, SlidersHorizontalIcon } from '@/shared/components/icons';
import { Button } from '@/shared/components/ui';

interface FilterBarProps {
  courseCount: number;
  onFilterClick: () => void;
  isFilterActive: boolean;
  onSortClick: () => void;
  isSortActive: boolean;
}

const FilterBar = ({
  courseCount,
  onFilterClick,
  isFilterActive,
  onSortClick,
  isSortActive,
}: FilterBarProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-1">
        <span className="text-gray-600">전체 골프장</span>
        <span className="font-bold text-green-900">{courseCount}</span>
      </div>
      <div className="flex items-center space-x-1 text-gray-600">
        <Button variant="ghost" size="icon" onClick={onFilterClick}>
          <FilterIcon
            className={`w-5 h-5 transition-colors ${isFilterActive ? 'text-teal-600' : 'text-gray-600'}`}
          />
        </Button>
        <Button variant="ghost" size="icon" onClick={onSortClick}>
          <SlidersHorizontalIcon
            className={`w-5 h-5 transition-colors ${isSortActive ? 'text-teal-600' : 'text-gray-600'}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
