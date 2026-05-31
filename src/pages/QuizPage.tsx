import AppHeader from "../components/AppHeader";
import QuizNavBar from "../components/quiz/QuizNavBar";
import QuizBoard from "../components/quiz/QuizBoard";

export default function QuizPage() {
  return (
    <div className="h-svh flex flex-col overflow-hidden bg-background">
      <AppHeader />
      <QuizNavBar />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <QuizBoard />
      </main>
    </div>
  );
}
