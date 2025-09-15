import {
  ChevronLeftIcon as HeroChevronLeftIcon,
  MagnifyingGlassIcon as HeroSearchIcon,
  CalendarDaysIcon as HeroCalendarIcon,
  ChevronDownIcon as HeroChevronDownIcon,
  FunnelIcon as HeroFilterIcon,
  AdjustmentsHorizontalIcon as HeroSlidersHorizontalIcon,
  ChevronUpIcon as HeroChevronUpIcon,
  XMarkIcon as HeroXIcon,
  MapPinIcon as HeroMapPinIcon,
  ClockIcon as HeroClockIcon,
  TagIcon as HeroTagIcon,
  UsersIcon as HeroUsersIcon,
  CreditCardIcon as HeroCreditCardIcon,
  ShareIcon as HeroShareIcon,
  PhoneIcon as HeroPhoneIcon,
  CheckCircleIcon as HeroCheckCircleIcon,
  CheckIcon as HeroCheckIcon,
  ChevronRightIcon as HeroChevronRightIcon,
  ClipboardDocumentIcon as HeroClipboardIcon,
  XCircleIcon as HeroCancellationIcon,
  DocumentDuplicateIcon as HeroCopyIcon,
} from '@heroicons/react/24/outline';

type IconProps = {
  className?: string;
};

export const ChevronLeftIcon = (props: IconProps) => <HeroChevronLeftIcon {...props} />;
export const SearchIcon = (props: IconProps) => <HeroSearchIcon {...props} />;
export const CalendarIcon = (props: IconProps) => <HeroCalendarIcon {...props} />;
export const ChevronDownIcon = (props: IconProps) => <HeroChevronDownIcon {...props} />;
export const FilterIcon = (props: IconProps) => <HeroFilterIcon {...props} />;
export const SlidersHorizontalIcon = (props: IconProps) => <HeroSlidersHorizontalIcon {...props} />;
export const ChevronUpIcon = (props: IconProps) => <HeroChevronUpIcon {...props} />;
export const XIcon = (props: IconProps) => <HeroXIcon {...props} />;
export const LocationPinIcon = (props: IconProps) => <HeroMapPinIcon {...props} />;
export const ClockIcon = (props: IconProps) => <HeroClockIcon {...props} />;
export const TagIcon = (props: IconProps) => <HeroTagIcon {...props} />;
export const UsersIcon = (props: IconProps) => <HeroUsersIcon {...props} />;
export const CreditCardIcon = (props: IconProps) => <HeroCreditCardIcon {...props} />;
export const ShareIcon = (props: IconProps) => <HeroShareIcon {...props} />;
export const PhoneIcon = (props: IconProps) => <HeroPhoneIcon {...props} />;
export const MapPinIcon = (props: IconProps) => <HeroMapPinIcon {...props} />;
export const CheckCircleIcon = (props: IconProps) => <HeroCheckCircleIcon {...props} />;

export const CheckIcon = (props: IconProps) => <HeroCheckIcon {...props} strokeWidth={3} />;
export const ChevronRightIcon = (props: IconProps) => <HeroChevronRightIcon {...props} />;
export const ClipboardIcon = (props: IconProps) => <HeroClipboardIcon {...props} />;
export const CopyIcon = (props: IconProps) => <HeroCopyIcon {...props} />;

export const CancellationIcon = (props: IconProps) => <HeroCancellationIcon {...props} />;
