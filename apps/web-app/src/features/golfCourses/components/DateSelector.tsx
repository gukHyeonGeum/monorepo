import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useGolfStore } from '@/shared/store/createStore';
import { getDaysRange, isSameDay, formatMonth, formatDay, getDayOfWeek } from '@/shared/utils/date';
import { ChevronDownIcon } from '@/shared/components/icons';

interface DateSelectorProps {
  daysToShow?: number;
  controlledDate?: Date;
  onDateChange?: (date: Date) => void;
}

const DateSelector = ({ daysToShow = 60, controlledDate, onDateChange }: DateSelectorProps) => {
  const storeSelectedDate = useGolfStore((state) => state.selectedDate);
  const storeSetSelectedDate = useGolfStore((state) => state.setSelectedDate);
  const availableMonths = useGolfStore((state) => state.availableMonths);

  const selectedDate = controlledDate || storeSelectedDate;
  const setSelectedDate = onDateChange || storeSetSelectedDate;

  const [startDate] = useState(() => new Date());
  const days = useMemo(() => getDaysRange(startDate, daysToShow), [startDate, daysToShow]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProgrammaticScroll = useRef(false);
  const prevSelectedDateRef = useRef<Date | undefined>(undefined);

  const [displayMonthValue, setDisplayMonthValue] = useState(() =>
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString()
  );

  useEffect(() => {
    setDisplayMonthValue(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString()
    );
  }, [selectedDate]);

  useEffect(() => {
    const selectedDayKey = selectedDate.toISOString().split('T')[0];
    const selectedDayElement = dayRefs.current.get(selectedDayKey!);

    if (selectedDayElement && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const elementLeft = selectedDayElement.offsetLeft;
      const elementWidth = selectedDayElement.offsetWidth;
      const containerWidth = container.offsetWidth;

      const scrollPosition = elementLeft - containerWidth / 2 + elementWidth / 2;

      let scrollBehavior: ScrollBehavior = 'smooth';
      if (prevSelectedDateRef.current) {
        const timeDiff = Math.abs(selectedDate.getTime() - prevSelectedDateRef.current.getTime());
        const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
        if (dayDiff > 7) {
          scrollBehavior = 'auto';
        }
      } else {
        scrollBehavior = 'auto';
      }

      isProgrammaticScroll.current = true;
      container.scrollTo({
        left: scrollPosition,
        behavior: scrollBehavior,
      });

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }

    prevSelectedDateRef.current = selectedDate;
  }, [selectedDate]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthDate = new Date(e.target.value);
    const today = new Date();

    if (
      newMonthDate.getFullYear() === today.getFullYear() &&
      newMonthDate.getMonth() === today.getMonth()
    ) {
      setSelectedDate(today);
    } else {
      const firstDayOfMonth = new Date(newMonthDate.getFullYear(), newMonthDate.getMonth(), 1);
      setSelectedDate(firstDayOfMonth);
    }
  };

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) {
      return;
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;

      let closestIndex = -1;
      let minDistance = Infinity;

      days.forEach((day, index) => {
        const dayKey = day.toISOString().split('T')[0];
        const element = dayRefs.current.get(dayKey!);
        if (element) {
          const elementCenter = element.offsetLeft + element.offsetWidth / 2;
          const distance = Math.abs(elementCenter - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== -1) {
        const centerDate = days[closestIndex];
        if (centerDate) {
          const newMonthValue = new Date(
            centerDate.getFullYear(),
            centerDate.getMonth(),
            1
          ).toISOString();
          setDisplayMonthValue(newMonthValue);
        }
      }
    }, 150);
  }, [days]);

  return (
    <div className="bg-white px-4 py-2 border-b flex items-center space-x-4">
      <div className="relative flex-shrink-0">
        <select
          value={displayMonthValue}
          onChange={handleMonthChange}
          className="appearance-none bg-transparent text-gray-800 text-xl font-bold pr-7 border-none focus:ring-0"
          aria-label="Select month"
        >
          {availableMonths.map((month) => (
            <option key={month.toISOString()} value={month.toISOString()}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
      </div>
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 flex items-center space-x-1 overflow-x-auto no-scrollbar min-w-0"
      >
        {days.map((day) => {
          const dayKey = day.toISOString().split('T')[0];
          const isSelected = isSameDay(day, selectedDate);
          const dayOfWeek = day.getDay();
          const isSaturday = dayOfWeek === 6;
          const isSunday = dayOfWeek === 0;

          let dayOfWeekColor = 'text-gray-400';
          if (isSaturday) dayOfWeekColor = 'text-blue-500';
          if (isSunday) dayOfWeekColor = 'text-red-500';
          if (isSelected) dayOfWeekColor = 'text-white';

          let dayNumberColor = 'text-gray-800';
          if (isSaturday) dayNumberColor = 'text-blue-500';
          if (isSunday) dayNumberColor = 'text-red-500';
          if (isSelected) dayNumberColor = 'text-white';

          return (
            <button
              key={dayKey}
              ref={(el) => {
                dayRefs.current.set(dayKey!, el);
              }}
              onClick={() => setSelectedDate(day)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-10 h-[4.5rem] rounded-full transition-colors duration-200 ${
                isSelected ? 'bg-green-900' : 'bg-transparent'
              }`}
              aria-label={`Select date ${formatMonth(day)} ${formatDay(day)}`}
            >
              <span className={`text-sm font-medium ${dayOfWeekColor}`}>{getDayOfWeek(day)}</span>
              <span className={`mt-1 text-lg font-bold ${dayNumberColor}`}>{formatDay(day)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
