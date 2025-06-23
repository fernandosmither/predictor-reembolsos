import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled = false,
  className,
  error = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
      focusedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          setFocusedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  return (
    <div 
      ref={selectRef}
      className={cn('relative', className)}
    >
      {/* Select trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 text-left cursor-pointer',
          'bg-slate-800/50 border border-slate-600/50 rounded-lg',
          'backdrop-blur-sm transition-all duration-300',
          'hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
          'focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
          {
            'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]': isOpen,
            'border-red-500/50 hover:border-red-500': error,
            'opacity-50 cursor-not-allowed pointer-events-none': disabled,
          }
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        <span className={cn(
          'transition-colors duration-200',
          selectedOption ? 'text-cyan-100' : 'text-slate-400'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        
        <ChevronDown 
          className={cn(
            'w-5 h-5 text-cyan-300 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 animate-in fade-in-0 zoom-in-95 duration-200">
          <div 
            ref={listRef}
            role="listbox"
            className={cn(
              'max-h-60 overflow-y-auto rounded-lg border border-slate-600/50',
              'bg-slate-800/90 backdrop-blur-lg shadow-2xl',
              'shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            )}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={cn(
                  'flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200',
                  'hover:bg-cyan-500/10 hover:text-cyan-200',
                  {
                    'bg-cyan-500/20 text-cyan-100': option.value === value,
                    'bg-cyan-500/10 text-cyan-200': index === focusedIndex && option.value !== value,
                    'text-slate-300': option.value !== value && index !== focusedIndex,
                  }
                )}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-cyan-400 animate-in fade-in duration-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 