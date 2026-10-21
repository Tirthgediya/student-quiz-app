import { Router } from "express";
import { questions } from "../data/questions";

const router = Router();

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i]
    ];
  }

  return shuffled;
}

// Get quiz questions
router.get("/questions", (req, res) => {
  const quizQuestions = questions.map((question) => {
    const shuffledOptions = shuffleArray(question.options);

    return {
      id: question.id,
      question: question.question,
      options: shuffledOptions
    };
  });

  res.json(quizQuestions);
});

// Submit quiz
router.post("/submit", (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: "Answers must be provided as an array."
    });
  }

  if (answers.length !== questions.length) {
    return res.status(400).json({
      message: `Please answer all ${questions.length} questions.`
    });
  }

  let score = 0;

  answers.forEach(
    (
      answer: {
        questionId: number;
        selectedAnswer: string;
      }
    ) => {
      const question = questions.find(
        (q) => q.id === answer.questionId
      );

      if (!question) {
        return;
      }

      const correctAnswer =
        question.options[question.answer];

      if (answer.selectedAnswer === correctAnswer) {
        score++;
      }
    }
  );

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  const status =
    percentage >= 60 ? "PASS" : "FAIL";

  res.json({
    score,
    total: questions.length,
    percentage,
    status,
    message: "Quiz completed successfully"
  });
});

// API status
router.get("/status", (req, res) => {
  res.json({
    status: "online",
    totalQuestions: questions.length,
    message: "Student Quiz API is running successfully"
  });
});

export default router;