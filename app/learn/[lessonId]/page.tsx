"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { Sources } from "@/components/Sources";
import { btnAccent, btnGhost, btnPrimary, card, chip } from "@/components/ui";
import { LEARN_CATEGORIES, LESSONS } from "@/content/learn";
import type { Lesson, QuizQuestion } from "@/lib/learn";
import { correctAnswerText, isCorrect, parseNumericAnswer } from "@/lib/quiz";
import type { LessonResult } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = LESSONS.find((l) => l.id === lessonId);

  return (
    <AppShell>
      {lesson ? (
        <LessonFlow key={lesson.id} lesson={lesson} />
      ) : (
        <div className={card}>
          <p className="font-bold">Lesson not found.</p>
          <Link href="/learn" className={`${btnPrimary} mt-4`}>Back to Learn</Link>
        </div>
      )}
    </AppShell>
  );
}

function LessonFlow({ lesson }: { lesson: Lesson }) {
  const [stage, setStage] = useState<"read" | "quiz" | "done">("read");
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState<{ answers: Record<string, string>; result: LessonResult } | null>(null);
  const category = LEARN_CATEGORIES[lesson.category];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/learn" className={`${chip} bg-violet-100 text-violet-700`}>
          <Icon name={category.icon} className="h-3.5 w-3.5" /> {category.title}
        </Link>
        <span className={`${chip} bg-orange-100 text-orange-700`}>{lesson.minutes} min</span>
        {lesson.factsAsOf && (
          <span className={`${chip} bg-emerald-50 text-emerald-700`}>
            <Icon name="check" className="h-3.5 w-3.5" /> Checked {lesson.factsAsOf}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <IconBadge name={lesson.icon} tone="violet" size="lg" />
        <div>
          <h1 className="text-2xl leading-tight font-extrabold">{lesson.title}</h1>
          <p className="text-sm text-violet-900/60">{lesson.tagline}</p>
        </div>
      </div>

      {stage === "read" && <Reader lesson={lesson} onDone={() => setStage("quiz")} />}
      {stage === "quiz" && (
        <Quiz
          key={round}
          lesson={lesson}
          onFinish={(answers, result) => {
            setFinished({ answers, result });
            setStage("done");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {stage === "done" && finished && (
        <Results
          lesson={lesson}
          answers={finished.answers}
          result={finished.result}
          onRetry={() => {
            setRound((r) => r + 1);
            setStage("quiz");
          }}
        />
      )}
    </div>
  );
}

function Reader({ lesson, onDone }: { lesson: Lesson; onDone(): void }) {
  const [index, setIndex] = useState(0);
  const current = lesson.cards[index];
  const last = index === lesson.cards.length - 1;

  return (
    <div className="mt-5">
      <div className="flex gap-1.5">
        {lesson.cards.map((c, i) => (
          <span key={c.title} className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-violet-500" : "bg-violet-100"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.18 }}
          className={`${card} mt-4`}
        >
          <IconBadge name={current.icon} tone={index % 2 ? "softOrange" : "soft"} />
          <h2 className="mt-3 text-xl font-extrabold">{current.title}</h2>
          <p className="mt-2 text-lg leading-relaxed">{current.body}</p>
          {current.example && (
            <div className="mt-4 flex gap-3 rounded-2xl bg-orange-50 p-3 ring-1 ring-orange-200">
              <Icon name="lightbulb" className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <p className="text-sm">
                <span className="font-bold text-orange-700">Example: </span>
                {current.example}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-3">
        {index > 0 && (
          <button type="button" onClick={() => setIndex(index - 1)} className={`${btnGhost} w-auto`} aria-label="Previous card">
            <Icon name="arrowLeft" />
          </button>
        )}
        {last ? (
          <button type="button" onClick={onDone} className={btnAccent}>
            <Icon name="zap" /> Take the quiz ({lesson.quiz.length} questions)
          </button>
        ) : (
          <button type="button" onClick={() => setIndex(index + 1)} className={btnPrimary}>
            Next <Icon name="arrowRight" />
          </button>
        )}
      </div>

      <Sources references={lesson.references} factsAsOf={lesson.factsAsOf} />
    </div>
  );
}

function Quiz({
  lesson,
  onFinish,
}: {
  lesson: Lesson;
  onFinish(answers: Record<string, string>, result: LessonResult): void;
}) {
  const { recordLesson } = useProgress();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = lesson.quiz[index];
  const answer = answers[question.id] ?? "";
  const last = index === lesson.quiz.length - 1;
  const ready = question.kind === "mcq" ? Boolean(answer) : parseNumericAnswer(answer) !== null;
  const right = isCorrect(question, answer);
  const setAnswer = (value: string) => setAnswers((a) => ({ ...a, [question.id]: value }));

  function check(e?: FormEvent) {
    e?.preventDefault();
    if (ready) setChecked(true);
  }

  async function next() {
    if (!last) {
      setIndex(index + 1);
      setChecked(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const correct = lesson.quiz.filter((q) => isCorrect(q, answers[q.id])).length;
      const result = await recordLesson({ lessonId: lesson.id, correct, total: lesson.quiz.length });
      onFinish(answers, result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your result");
      setSaving(false);
    }
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between text-sm font-bold text-violet-500">
        <span>
          Question {index + 1} of {lesson.quiz.length}
        </span>
        <span className={`${chip} ${question.kind === "numeric" ? "bg-orange-100 text-orange-700" : "bg-violet-100 text-violet-700"}`}>
          <Icon name={question.kind === "numeric" ? "calculator" : "target"} className="h-3.5 w-3.5" />
          {question.kind === "numeric" ? "Calculate" : "Choose"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <p className="mt-3 text-xl leading-snug font-extrabold">{question.prompt}</p>

          {question.kind === "mcq" ? (
            <div className="mt-4 space-y-3">
              {question.options.map((option, i) => {
                const picked = answer === option.id;
                const isAnswer = checked && option.id === question.correctOptionId;
                const wrongPick = checked && picked && !isAnswer;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={checked}
                    onClick={() => setAnswer(option.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left font-semibold ring-2 transition ${
                      isAnswer
                        ? "ring-emerald-400"
                        : wrongPick
                          ? "ring-orange-400"
                          : picked
                            ? "ring-violet-500"
                            : "ring-violet-100 hover:ring-violet-300"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${
                        isAnswer ? "bg-emerald-500 text-white" : picked ? "bg-violet-500 text-white" : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      {LETTERS[i]}
                    </span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={check} className="mt-4">
              <div
                className={`flex items-center rounded-2xl bg-white ring-2 ${
                  checked ? (right ? "ring-emerald-400" : "ring-orange-400") : "ring-violet-200 focus-within:ring-violet-500"
                }`}
              >
                {question.unit === "LKR" && <span className="pl-4 font-extrabold text-violet-400">LKR</span>}
                <input
                  inputMode="decimal"
                  autoComplete="off"
                  value={answer}
                  disabled={checked}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") check(e);
                  }}
                  enterKeyHint="done"
                  placeholder="Your answer"
                  aria-label="Your answer"
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-lg font-bold outline-none"
                />
                {question.unit !== "LKR" && question.unit !== "units" && (
                  <span className="pr-4 font-extrabold text-violet-400">{question.unit}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-violet-900/50">Numbers only; commas are fine. Use a minus sign for losses.</p>
            </form>
          )}

          {checked && <Feedback question={question} right={right} />}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-3 text-sm font-semibold text-orange-600">{error}</p>}

      {checked ? (
        <button type="button" onClick={next} disabled={saving} className={`${btnPrimary} mt-5`}>
          {saving && <Icon name="loader" className="h-5 w-5 animate-spin" />}
          {last ? "See results" : "Next question"} <Icon name="arrowRight" />
        </button>
      ) : (
        <button type="button" onClick={() => check()} disabled={!ready} className={`${btnAccent} mt-5`}>
          <Icon name="check" /> Check answer
        </button>
      )}
    </div>
  );
}

function Feedback({ question, right }: { question: QuizQuestion; right: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 rounded-2xl p-4 ring-1 ${right ? "bg-emerald-50 ring-emerald-200" : "bg-orange-50 ring-orange-200"}`}
    >
      <p className={`flex items-center gap-2 font-extrabold ${right ? "text-emerald-700" : "text-orange-700"}`}>
        <Icon name={right ? "check" : "lightbulb"} className="h-5 w-5" />
        {right ? "Correct!" : `Not quite. Answer: ${correctAnswerText(question)}`}
      </p>
      <p className="mt-1 text-sm">{question.explanation}</p>
    </motion.div>
  );
}

function Results({
  lesson,
  answers,
  result,
  onRetry,
}: {
  lesson: Lesson;
  answers: Record<string, string>;
  result: LessonResult;
  onRetry(): void;
}) {
  const perfect = result.correct === result.total;
  const nextLesson = LESSONS[LESSONS.findIndex((l) => l.id === lesson.id) + 1];

  const yourAnswer = (q: QuizQuestion) => {
    const raw = answers[q.id];
    if (q.kind === "mcq") return q.options.find((o) => o.id === raw)?.text ?? "No answer";
    return raw ? `${q.unit === "LKR" ? "LKR " : ""}${raw}${q.unit === "%" ? "%" : ""}` : "No answer";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
      <div
        className={`flex items-center gap-4 rounded-3xl p-5 text-white shadow-xl ${
          perfect
            ? "bg-linear-to-br from-violet-500 to-violet-700 shadow-violet-300/50"
            : "bg-linear-to-br from-orange-400 to-orange-500 shadow-orange-300/50"
        }`}
      >
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20">
          <Icon name={perfect ? "trophy" : "award"} className="h-8 w-8" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-extrabold">{perfect ? "Perfect score!" : "Lesson complete"}</p>
          <p className="text-sm opacity-90">
            You got {result.correct} of {result.total} right
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-violet-700">
          {result.xp > 0 ? `+${result.xp} XP` : "Replay"}
        </span>
      </div>

      <div className={card}>
        <p className="font-extrabold">Review</p>
        <ul className="mt-3 space-y-3">
          {lesson.quiz.map((q, i) => {
            const ok = isCorrect(q, answers[q.id]);
            return (
              <li key={q.id} className="flex gap-3">
                <IconBadge name={ok ? "check" : "x"} tone={ok ? "green" : "softOrange"} size="sm" />
                <div className="text-sm">
                  <p className="font-semibold">
                    {i + 1}. {q.prompt}
                  </p>
                  {!ok && (
                    <p className="mt-1 text-violet-900/60">
                      You said {yourAnswer(q)} · Answer: <span className="font-bold text-emerald-700">{correctAnswerText(q)}</span>
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Sources references={lesson.references} factsAsOf={lesson.factsAsOf} />

      {nextLesson && (
        <Link href={`/learn/${nextLesson.id}`} className={btnPrimary}>
          Next: {nextLesson.title} <Icon name="arrowRight" />
        </Link>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={onRetry} className={btnGhost}>
          <Icon name="retry" /> Retry quiz
        </button>
        <Link href="/learn" className={btnGhost}>
          <Icon name="graduation" /> All lessons
        </Link>
      </div>
    </motion.div>
  );
}
