import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { XIcon, CheckIcon } from '@/shared/components/icons';

// --- Utility Function ---
function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

// --- Button ---
const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-lg text-sm font-bold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  variant: {
    default: 'bg-teal-700 text-white hover:bg-teal-800',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'hover:bg-gray-100 hover:text-gray-800',
    link: 'text-teal-700 underline-offset-4 hover:underline',
    toggle:
      'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 data-[state=on]:border-teal-600 data-[state=on]:text-teal-600 data-[state=on]:bg-teal-50 data-[state=on]:font-bold',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8 py-3 text-lg',
    icon: 'h-10 w-10',
  },
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants.base,
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// --- Badge ---
const badgeVariants = {
  base: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  variant: {
    default: 'border-transparent bg-teal-700 text-white',
    secondary: 'border-transparent bg-gray-200 text-gray-600',
    destructive: 'border-transparent bg-red-100 text-red-600',
    outline: 'text-gray-900',
    scheduled: 'border-transparent bg-orange-100 text-orange-600',
  },
};
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants.variant;
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants.base, badgeVariants.variant[variant], className)} {...props} />
  );
}

// --- Card ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-bold text-gray-800', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-4 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

// --- Dialog ---
const DialogContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void }>(
  {
    open: false,
    onOpenChange: () => {},
  }
);

const useDialog = () => React.useContext(DialogContext);

const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
};

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? ReactDOM.createPortal(children, document.body) : null;
};

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = useDialog();
    return open ? (
      <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/60', className)} {...props} />
    ) : null;
  }
);
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDialog();
    const [isVisible, setIsVisible] = useState(open);

    useEffect(() => {
      if (open) setIsVisible(true);
    }, [open]);

    const handleAnimationEnd = () => {
      if (!open) setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
      <DialogPortal>
        <DialogOverlay onClick={() => onOpenChange(false)} />
        <div
          ref={ref}
          onAnimationEnd={handleAnimationEnd}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-9/10 max-w-sm transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl bg-white',
            open ? 'animate-content-show' : 'animate-content-hide',
            className
          )}
          {...props}
        >
          {children}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left p-6', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex sm:flex-row sm:justify-end sm:space-x-2 p-4 bg-gray-50 rounded-b-xl',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-xl font-bold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-600', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

// --- Sheet (Bottom Drawer) ---
const Sheet = Dialog;

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useDialog();
    const [isVisible, setIsVisible] = useState(open);

    useEffect(() => {
      if (open) setIsVisible(true);
    }, [open]);

    const handleAnimationEnd = () => {
      if (!open) setIsVisible(false);
    };

    if (!isVisible) return null;
    return (
      <DialogPortal>
        <DialogOverlay onClick={() => onOpenChange(false)} />
        <div
          ref={ref}
          onAnimationEnd={handleAnimationEnd}
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl',
            open ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </DialogPortal>
    );
  }
);
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex justify-between items-center p-4 border-gray-200', className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-bold', className)} {...props} />
  )
);
SheetTitle.displayName = 'SheetTitle';

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-gray-500', className)} {...props} />
));
SheetDescription.displayName = 'SheetDescription';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('p-4 flex space-x-3 bg-white border-t border-gray-200', className)}
    {...props}
  />
);

const SheetClose = ({ children }: { children: React.ReactNode }) => {
  const { onOpenChange } = useDialog();
  return <div onClick={() => onOpenChange(false)}>{children}</div>;
};

// --- AlertDialog ---
const AlertDialog = Dialog;
const AlertDialogAction = Button;
const AlertDialogCancel = Button;
const AlertDialogContent = DialogContent;
const AlertDialogDescription = DialogDescription;
const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0 space-x-3', className)}
    {...props}
  />
);
const AlertDialogHeader = DialogHeader;
const AlertDialogTitle = DialogTitle;

// --- Checkbox ---
interface CheckboxProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        className={cn(
          'peer h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
          'border-gray-200 bg-gray-200',
          'data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        <CheckIcon
          className={cn(
            'h-4 w-4 text-white transition-opacity',
            checked ? 'opacity-100' : 'opacity-0'
          )}
        />
      </button>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// --- RadioGroup ---
type RadioGroupContextType = {
  value: string | null;
  onValueChange: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextType | null>(null);

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string | null;
    onValueChange: (value: string) => void;
  }
>(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn('grid gap-2', className)} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const isSelected = context?.value === value;

    return (
      <button
        ref={ref}
        onClick={() => context?.onValueChange(value)}
        className={cn(
          `w-full text-left px-4 py-3 rounded-lg border text-base transition-colors duration-200`,
          isSelected
            ? 'border-teal-600 text-teal-600 bg-teal-50 font-bold'
            : 'border-gray-200 text-gray-700 bg-white hover:border-gray-400',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

// --- Tabs ---
type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};
const TabsContext = React.createContext<TabsContextType | null>(null);

const Tabs = ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
  );
};

const TabsList = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('flex bg-white sticky top-[61px] z-10 border-b', className)}>{children}</div>
);

const TabsTrigger = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.activeTab === value;
  return (
    <button
      onClick={() => context?.setActiveTab(value)}
      className={cn(
        'flex-1 py-3 text-center font-semibold',
        isActive ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500',
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const context = React.useContext(TabsContext);
  return context?.activeTab === value ? <div className={cn(className)}>{children}</div> : null;
};

// --- Separator ---
const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('shrink-0 bg-gray-200 h-[1px] w-full', className)} {...props} />
  )
);
Separator.displayName = 'Separator';

export {
  Button,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
};
