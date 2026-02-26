"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Exercise, Question } from "@/type";
import { getExerciseData } from "@/data/exerciseJsonData";

export const useExercise = () => {
  const params = useParams();
  const exerciseId = parseInt(params.id as string);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const foundExercise = getExerciseData.find(ex => ex.id === exerciseId);
      if (foundExercise) {
        setExercise(foundExercise);
        setQuestions([...foundExercise.questions]);
      }
    });
  }, [exerciseId]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / (exercise?.totalQuestions || 1)) * 100);
  const hasAnswered = currentQuestion?.userAnswer !== undefined && currentQuestion?.userAnswer !== null;

  const calculateScore = (): number => {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const getCorrectAnswersCount = (): number => {
    return questions.filter(q => q.isCorrect).length;
  };

  const handleAnswerChange = (answer: string | boolean) => {
    if (!currentQuestion) return;

    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect: answer === currentQuestion.correctAnswer
    };
    setQuestions(updatedQuestions);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (exercise && currentQuestionIndex < exercise.totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSkip = () => {
    if (exercise && currentQuestionIndex < exercise.totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const resetExercise = () => {
    setCurrentQuestionIndex(0);
    const resetQuestions = questions.map(q => ({
      ...q,
      userAnswer: undefined,
      isCorrect: undefined
    }));
    setQuestions(resetQuestions);
  };

  return {
    exercise,
    currentQuestion,
    currentQuestionIndex,
    questions,
    progress,
    hasAnswered,
    calculateScore,
    getCorrectAnswersCount,
    handleAnswerChange,
    handlePrevious,
    handleNext,
    handleSkip,
    resetExercise,
    setCurrentQuestionIndex
  };
};