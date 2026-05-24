import type { Category, Difficulty } from '../../data/quizTypes';

interface ChallengeMetaProps {
  category: Category;
  difficulty: Difficulty;
  modeLabel?: string;
}

export default function ChallengeMeta({ category, difficulty, modeLabel }: ChallengeMetaProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
          {category}
        </span>
        {modeLabel && (
          <span className="text-sm font-medium px-3 py-1 rounded-full border border-border bg-accent/10 text-foreground">
            {modeLabel}
          </span>
        )}
      </div>
      <span className="text-sm font-medium px-3 py-1 rounded-full border border-border bg-accent/10 text-tertiary">
        {difficulty}
      </span>
    </div>
  );
}
