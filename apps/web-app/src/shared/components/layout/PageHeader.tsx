import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';
import { ChevronLeftIcon } from '@/shared/components/icons';

interface PageHeaderProps {
  title?: React.ReactNode;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

/**
 * @example
 * <PageHeader title="My Page" />
 * <PageHeader title="Settings" rightContent={<SettingsButton />} />
 * <PageHeader onBackClick={() => navigate('/home')} />
 */
export const PageHeader = ({
  title,
  onBackClick,
  rightContent,
  className = '',
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = onBackClick || (() => navigate(-1));

  return (
    <header
      className={`grid grid-cols-[1fr_auto_1fr] items-center p-4 bg-white border-b sticky top-0 z-10 ${className}`}
    >
      <div className="flex justify-start">
        <Button
          onClick={handleBack}
          aria-label="Go back"
          variant="ghost"
          size="icon"
          className="-ml-2"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
        </Button>
      </div>
      <div className="text-center px-2">
        {typeof title === 'string' ? (
          <h1 className="text-lg font-bold text-gray-800 truncate">{title}</h1>
        ) : (
          title
        )}
      </div>
      <div className="flex justify-end">{rightContent}</div>
    </header>
  );
};
