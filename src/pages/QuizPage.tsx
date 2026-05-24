import { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import QuizNavBar from "../components/quiz/QuizNavBar";
import QuizBoard from "../components/quiz/QuizBoard";
import { updateSEO } from "../utils/seo";

export default function QuizPage() {
  useEffect(() => {
    updateSEO({
      title: "Networking Quiz Game - OSI Model Simulator",
      description: "Test your knowledge of the OSI Model, TCP/IP, and general networking concepts in this interactive quiz game.",
      canonicalUrl: "https://app.osi-model-simulator.roboticela.com/quiz",
    });
  }, []);

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
