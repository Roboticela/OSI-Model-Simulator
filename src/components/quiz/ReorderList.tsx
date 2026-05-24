import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ReorderListProps {
  items: string[];
  onChange: (items: string[]) => void;
  submitted: boolean;
  correctOrder: string[];
  hint: string;
  renderBadge?: (item: string, index: number) => React.ReactNode;
}

export default function ReorderList({
  items,
  onChange,
  submitted,
  correctOrder,
  hint,
  renderBadge,
}: ReorderListProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const moveSelected = (direction: -1 | 1) => {
    if (selectedIndex === null || submitted) return;
    const target = selectedIndex + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[selectedIndex], next[target]] = [next[target], next[selectedIndex]];
    onChange(next);
    setSelectedIndex(target);
  };

  return (
    <div>
      <p className="text-sm text-tertiary mb-4">{hint}</p>

      <div className="space-y-2 mb-4">
        {items.map((item, index) => {
          const isSelected = selectedIndex === index && !submitted;
          const isRight = submitted && item === correctOrder[index];
          const isWrong = submitted && item !== correctOrder[index];

          return (
            <button
              key={`${item}-${index}`}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedIndex(index)}
              className={clsx(
                'w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-colors min-h-[52px]',
                isSelected && 'border-primary bg-primary/10 ring-2 ring-primary/20',
                !submitted && !isSelected && 'border-border bg-card hover:bg-accent',
                isRight && 'border-primary bg-primary/10',
                isWrong && 'border-border bg-accent/20'
              )}
            >
              {renderBadge ? renderBadge(item, index) : (
                <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {index + 1}
                </span>
              )}
              <span className={clsx(
                'flex-1 font-medium text-sm',
                isRight && 'text-primary',
                isWrong && 'text-foreground',
                !submitted && 'text-foreground'
              )}>
                {item}
              </span>
              {submitted && isRight && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
              {submitted && isWrong && <XCircle className="w-4 h-4 text-tertiary flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {!submitted && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 rounded-lg border border-border bg-accent/5">
          <p className="text-xs text-tertiary sm:flex-1 sm:self-center">
            {selectedIndex === null
              ? 'Tap a row to select it, then move it'
              : `Moving: "${items[selectedIndex]}"`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-lg gap-1 min-h-10"
              disabled={selectedIndex === null || selectedIndex === 0}
              onClick={() => moveSelected(-1)}
            >
              <ChevronUp className="w-4 h-4" />
              Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none rounded-lg gap-1 min-h-10"
              disabled={selectedIndex === null || selectedIndex === items.length - 1}
              onClick={() => moveSelected(1)}
            >
              <ChevronDown className="w-4 h-4" />
              Down
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
