import { GROUPS, MUSCLES } from "@/data/muscles";
import {
  emptyAnswers,
  EXAM_MAX_NOTA,
  EXAM_SIZE,
  FIELDS,
  type Answers,
  type DeviceMode,
  type MuscleReview,
  type StudyFilter,
} from "@/data/types";
import { countGrades, pointsForGrade, questionScore, worstGrade } from "./localEvaluate";

export const STORAGE_KEY = "musculos-ia-progress-v1";

export type ExamSession = {
  queue: number[];
  groupIds: string[];
  answers: Record<string, Answers>;
  reviews: Record<string, MuscleReview>;
  reveal: Record<string, boolean>;
  startedAt: number;
};

export type ProgressState = {
  version: 1;
  mode: DeviceMode | null;
  currentIndex: number;
  filter: StudyFilter;
  answers: Record<string, Answers>;
  reviews: Record<string, MuscleReview>;
  flagged: string[];
  reveal: Record<string, boolean>;
  exam: ExamSession | null;
  lastVisitedAt: number;
};

export const defaultProgress = (): ProgressState => ({
  version: 1,
  mode: null,
  currentIndex: 0,
  filter: "all",
  answers: {},
  reviews: {},
  flagged: [],
  reveal: {},
  exam: null,
  lastVisitedAt: Date.now(),
});

function sanitizeExam(raw: unknown): ExamSession | null {
  if (!raw || typeof raw !== "object") return null;
  const exam = raw as Partial<ExamSession>;
  const queue = Array.isArray(exam.queue)
    ? exam.queue.filter(
        (index): index is number =>
          Number.isInteger(index) && index >= 0 && index < MUSCLES.length,
      )
    : [];
  if (queue.length === 0) return null;
  const validGroupIds = new Set(GROUPS.map((group) => group.id));
  const groupIds = Array.isArray(exam.groupIds)
    ? exam.groupIds.filter((id): id is string => typeof id === "string" && validGroupIds.has(id))
    : [];
  return {
    queue,
    groupIds,
    answers: exam.answers ?? {},
    reviews: exam.reviews ?? {},
    reveal: exam.reveal ?? {},
    startedAt: typeof exam.startedAt === "number" ? exam.startedAt : Date.now(),
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (parsed.version !== 1) return defaultProgress();
    const exam = sanitizeExam(parsed.exam);
    const filter =
      parsed.filter === "exam" && !exam ? "all" : (parsed.filter ?? "all");
    return {
      ...defaultProgress(),
      ...parsed,
      answers: parsed.answers ?? {},
      reviews: parsed.reviews ?? {},
      flagged: parsed.flagged ?? [],
      reveal: parsed.reveal ?? {},
      exam,
      filter,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, lastVisitedAt: Date.now() }),
    );
  } catch {
    // Storage full or blocked — studying still works in-session.
  }
}

export function getAnswers(
  state: ProgressState,
  muscleId: string,
): Answers {
  if (state.filter === "exam") {
    return state.exam?.answers[muscleId] ?? emptyAnswers();
  }
  return state.answers[muscleId] ?? emptyAnswers();
}

export function statsFrom(state: ProgressState) {
  let correct = 0;
  let partial = 0;
  let incorrect = 0;
  for (const muscle of MUSCLES) {
    const review = state.reviews[muscle.id];
    if (!review) continue;
    const worst = worstGrade(review);
    if (worst === "correct") correct += 1;
    else if (worst === "partial") partial += 1;
    else incorrect += 1;
  }
  const reviewed = correct + partial + incorrect;
  return {
    correct,
    partial,
    incorrect,
    reviewed,
    total: MUSCLES.length,
    percent: MUSCLES.length
      ? Math.round((reviewed / MUSCLES.length) * 100)
      : 0,
  };
}

export function examStatsFrom(state: ProgressState) {
  const exam = state.exam;
  const total = exam?.queue.length ?? 0;
  let correct = 0;
  let partial = 0;
  let incorrect = 0;
  let fieldsCorrect = 0;
  let fieldsPartial = 0;
  let fieldsIncorrect = 0;

  if (exam) {
    for (const index of exam.queue) {
      const muscle = MUSCLES[index];
      if (!muscle) continue;
      const review = exam.reviews[muscle.id];
      if (!review) continue;
      const worst = worstGrade(review);
      if (worst === "correct") correct += 1;
      else if (worst === "partial") partial += 1;
      else incorrect += 1;
      const tally = countGrades(review);
      fieldsCorrect += tally.correct;
      fieldsPartial += tally.partial;
      fieldsIncorrect += tally.incorrect;
    }
  }

  const reviewed = correct + partial + incorrect;
  const points =
    fieldsCorrect * pointsForGrade("correct") + fieldsPartial * pointsForGrade("partial");
  const maxPoints = total * FIELDS.length;
  // 5 músculos × 5 casillas = 25. Cada pregunta vale 1 (casillas/5).
  // 25 ÷ 5 = nota sobre 5.
  const nota = Math.round((points / FIELDS.length) * 10) / 10;
  return {
    correct,
    partial,
    incorrect,
    reviewed,
    total,
    percent: total ? Math.round((reviewed / total) * 100) : 0,
    fieldsCorrect,
    fieldsPartial,
    fieldsIncorrect,
    fieldsTotal: maxPoints,
    points,
    maxPoints,
    nota,
    maxNota: EXAM_MAX_NOTA,
    complete: total > 0 && reviewed === total,
  };
}

export function errorMuscleIds(state: ProgressState): string[] {
  return MUSCLES.filter((muscle) => {
    const review = state.reviews[muscle.id];
    if (!review) return false;
    const worst = worstGrade(review);
    return worst === "incorrect" || worst === "partial";
  }).map((muscle) => muscle.id);
}

export function examPoolIndices(groupIds?: string[]): number[] {
  if (!groupIds || groupIds.length === 0) {
    return MUSCLES.map((_, index) => index);
  }
  const selected = new Set(groupIds);
  return MUSCLES.map((muscle, index) => (selected.has(muscle.groupId) ? index : -1)).filter(
    (index) => index >= 0,
  );
}

export function pickRandomMuscleIndices(count = EXAM_SIZE, groupIds?: string[]): number[] {
  const indices = examPoolIndices(groupIds);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = indices[i];
    indices[i] = indices[j]!;
    indices[j] = current!;
  }
  return indices.slice(0, Math.min(count, indices.length));
}

export function examScopeLabel(groupIds: string[]): string {
  if (!groupIds.length) return "Todo el temario";
  const names = GROUPS.filter((group) => groupIds.includes(group.id)).map(
    (group) => group.shortName,
  );
  return names.length ? names.join(" · ") : "Todo el temario";
}

export function filteredIndices(state: ProgressState): number[] {
  if (state.filter === "exam") {
    return state.exam?.queue ?? [];
  }
  if (state.filter === "all") {
    return MUSCLES.map((_, index) => index);
  }
  if (state.filter === "errors") {
    const ids = new Set(errorMuscleIds(state));
    return MUSCLES.map((muscle, index) => (ids.has(muscle.id) ? index : -1)).filter(
      (index) => index >= 0,
    );
  }
  if (state.filter === "flagged") {
    const ids = new Set(state.flagged);
    return MUSCLES.map((muscle, index) => (ids.has(muscle.id) ? index : -1)).filter(
      (index) => index >= 0,
    );
  }
  if (state.filter.startsWith("group:")) {
    const groupId = state.filter.slice("group:".length);
    return MUSCLES.map((muscle, index) =>
      muscle.groupId === groupId ? index : -1,
    ).filter((index) => index >= 0);
  }
  return MUSCLES.map((_, index) => index);
}

export { questionScore };
