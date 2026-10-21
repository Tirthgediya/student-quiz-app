"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface SelectedAnswer {
  questionId: number;
  selectedAnswer: string;
}

interface Result {
  score: number;
  total: number;
  percentage: number;
  status: string;
  message: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<
    SelectedAnswer[]
  >([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [result, setResult] =
    useState<Result | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Load questions
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to load questions"
          );
        }

        return response.json();
      })
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Unable to connect to the quiz server."
        );

        setLoading(false);
      });
  }, []);

  // Select answer
  const selectAnswer = (
    selectedAnswer: string
  ) => {
    const questionId =
      questions[currentQuestion].id;

    const updatedAnswers = [...answers];

    const existingAnswer =
      updatedAnswers.findIndex(
        (answer) =>
          answer.questionId === questionId
      );

    const newAnswer: SelectedAnswer = {
      questionId,
      selectedAnswer
    };

    if (existingAnswer !== -1) {
      updatedAnswers[existingAnswer] =
        newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }

    setAnswers(updatedAnswers);
  };

  // Get selected answer
  const getSelectedAnswer = () => {
    if (!questions[currentQuestion]) {
      return "";
    }

    const questionId =
      questions[currentQuestion].id;

    const answer = answers.find(
      (item) =>
        item.questionId === questionId
    );

    return answer
      ? answer.selectedAnswer
      : "";
  };

  // Next question
  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // Previous question
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (answers.length !== questions.length) {
      setError(
        "Please answer all questions before submitting."
      );

      return;
    }

    try {
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/submit",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            answers
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          "Submission failed"
        );
      }

      const data: Result =
        await response.json();

      setResult(data);
    } catch {
      setError(
        "Unable to submit the quiz."
      );
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setResult(null);
    setError("");
    setLoading(true);

    fetch("http://localhost:5000/api/questions")
      .then((response) =>
        response.json()
      )
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Unable to connect to the quiz server."
        );

        setLoading(false);
      });
  };

  // Loading screen
  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          <div
            className={styles.spinner}
          ></div>

          <p>Loading quiz...</p>
        </div>
      </main>
    );
  }

  // Error screen
  if (error && questions.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <h2>Connection Error</h2>

          <p>{error}</p>

          <p>
            Make sure the Express backend is
            running on port 5000.
          </p>
        </div>
      </main>
    );
  }

  // Result screen
  if (result) {
    const passed =
      result.percentage >= 60;

    return (
      <main className={styles.page}>
        <div className={styles.resultCard}>

          <div
            className={`${styles.resultIcon} ${
              passed
                ? styles.passIcon
                : styles.failIcon
            }`}
          >
            {passed ? "✓" : "✕"}
          </div>

          <h1>Quiz Completed!</h1>

          <p
            className={
              styles.resultMessage
            }
          >
            {result.message}
          </p>

          <div
            className={styles.scoreCircle}
          >
            <span>
              {result.percentage}%
            </span>
          </div>

          <h2>
            {result.score} /{" "}
            {result.total}
          </h2>

          <p
            className={
              styles.scoreText
            }
          >
            Your final score
          </p>

          <h2
            className={
              passed
                ? styles.passText
                : styles.failText
            }
          >
            {passed
              ? "PASS"
              : "FAIL"}
          </h2>

          <p className={styles.passRule}>
            Minimum Passing Percentage: 60%
          </p>

          <button
            className={
              styles.primaryButton
            }
            onClick={restartQuiz}
          >
            Restart Quiz
          </button>
        </div>
      </main>
    );
  }

  // Current question
  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <main className={styles.page}>

      <div
        className={
          styles.quizContainer
        }
      >

        {/* Header */}

        <header
          className={styles.header}
        >
          <div>

            <p
              className={styles.tag}
            >
              FULL-STACK MINI PROJECT
            </p>

            <h1>
              Student Quiz App
            </h1>

            <p
              className={
                styles.subtitle
              }
            >
              Test your knowledge and
              see your score instantly.
            </p>

          </div>

          <div
            className={
              styles.questionCount
            }
          >
            {currentQuestion + 1} /{" "}
            {questions.length}
          </div>

        </header>

        {/* Progress */}

        <div
          className={
            styles.progressArea
          }
        >

          <div
            className={
              styles.progressBar
            }
          >
            <div
              className={
                styles.progress
              }
              style={{
                width: `${progress}%`
              }}
            ></div>
          </div>

          <p>
            Question{" "}
            {currentQuestion + 1}{" "}
            of{" "}
            {questions.length}
          </p>

        </div>

        {/* Error message */}

        {error && (
          <div
            className={
              styles.smallError
            }
          >
            {error}
          </div>
        )}

        {/* Question */}

        <section
          className={
            styles.questionCard
          }
        >

          <h2>
            {question.question}
          </h2>

          <div
            className={
              styles.options
            }
          >

            {question.options.map(
              (option, index) => (
                <button
                  key={option}
                  className={`${
                    styles.option
                  } ${
                    getSelectedAnswer() ===
                    option
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() =>
                    selectAnswer(
                      option
                    )
                  }
                >

                  <span
                    className={
                      styles.optionLetter
                    }
                  >
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>
                    {option}
                  </span>

                </button>
              )
            )}

          </div>

        </section>

        {/* Navigation */}

        <div
          className={
            styles.navigation
          }
        >

          <button
            className={
              styles.secondaryButton
            }
            onClick={
              previousQuestion
            }
            disabled={
              currentQuestion === 0
            }
          >
            ← Previous
          </button>

          {currentQuestion ===
          questions.length - 1 ? (
            <button
              className={
                styles.submitButton
              }
              onClick={
                submitQuiz
              }
            >
              Submit Quiz
            </button>
          ) : (
            <button
              className={
                styles.primaryButton
              }
              onClick={
                nextQuestion
              }
            >
              Next →
            </button>
          )}

        </div>

        {/* Footer */}

        <footer
          className={styles.footer}
        >
          Built with Next.js,
          TypeScript, Node.js &
          Express
        </footer>

      </div>

    </main>
  );
}