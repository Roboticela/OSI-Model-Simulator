import { clsx } from 'clsx';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ChallengeFeedbackProps {
  isCorrect: boolean;
  title?: string;
  wrongTitle?: string;
  explanation: string;
  onNext: () => void;
  isLast: boolean;
  children?: React.ReactNode;
}

export default function ChallengeFeedback({
  isCorrect,
  title = 'Correct!',
  wrongTitle = 'Not quite right.',
  explanation,
  onNext,
  isLast,
  children,
}: ChallengeFeedbackProps) {
  return (
    <div className={clsx(
      'p-5 rounded-xl border',
      isCorrect ? 'bg-primary/5 border-primary/30' : 'bg-accent/10 border-border'
    )}>
      <h3 className={clsx(
        'font-semibold mb-2 flex items-center gap-2',
        isCorrect ? 'text-primary' : 'text-foreground'
      )}>
        {isCorrect ? (
          <><CheckCircle2 className="w-4 h-4" /> {title}</>
        ) : (
          <><XCircle className="w-4 h-4" /> {wrongTitle}</>
        )}
      </h3>
      {children}
      <p className="text-foreground/80 text-sm leading-relaxed mb-4">{explanation}</p>
      <div className="flex justify-end">
        <Button className="rounded-lg gap-2 min-h-11 px-6" onClick={onNext}>
          {isLast ? 'View Results' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
