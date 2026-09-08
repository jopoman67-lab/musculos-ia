import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MUSCLES } from "@/data/muscles";
import {
  emptyAnswers,
  EXAM_SIZE,
  type Answers,
  type DeviceMode,
  type FieldKey,
  type MuscleReview,
  type StudyFilter,
} from "@/data/types";
import {
  defaultProgress,
  examStatsFrom,
  filteredIndices,
  getAnswers,
  loadProgress,
  pickRandomMuscleIndices,
  saveProgress,
  statsFrom,
  type ProgressState,
} from "@/services/storage";

export type ExamStartOptions = {
  groupIds?: string[];
};

type StudyContextValue = {
  ready: boolean;
  state: ProgressState;
  stats: ReturnType<typeof statsFrom>;
  examStats: ReturnType<typeof examStatsFrom>;
  queue: number[];
  queuePosition: number;
  muscleIndex: number;
  setMode: (mode: DeviceMode) => void;
  startStudy: (filter?: StudyFilter, startIndex?: number) => void;
  startExam: (fresh?: boolean, options?: ExamStartOptions) => void;
  goHome: () => void;
  setField: (muscleId: string, field: FieldKey, value: string) => void;
  answersFor: (muscleId: string) => Answers;
  saveReview: (muscleId: string, review: MuscleReview) => void;
  toggleFlag: (muscleId: string) => void;
  clearAnswers: (muscleId: string) => void;
  toggleReveal: (muscleId: string) => void;
  goToQueueIndex: (position: number) => void;
  goNext: () => void;
  goPrev: () => void;
};

const StudyContext = createContext<StudyContextValue | null>(null);

function inExam(state: ProgressState): boolean {
  return state.filter === "exam" && Boolean(state.exam);
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProgress(state);
  }, [state, ready]);

  const stats = useMemo(() => statsFrom(state), [state]);
  const examStats = useMemo(() => examStatsFrom(state), [state]);
  const queue = useMemo(() => filteredIndices(state), [state]);

  const muscleIndex = Math.min(
    Math.max(0, state.currentIndex),
    Math.max(0, MUSCLES.length - 1),
  );

  const queuePosition = Math.max(
    0,
    queue.indexOf(muscleIndex) === -1 ? 0 : queue.indexOf(muscleIndex),
  );

  const setMode = useCallback((mode: DeviceMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const startStudy = useCallback(
    (filter: StudyFilter = "all", startIndex?: number) => {
      setState((prev) => {
        const next = { ...prev, filter };
        const indices = filteredIndices(next);
        if (indices.length === 0) {
          return { ...next, currentIndex: 0 };
        }
        if (typeof startIndex === "number" && indices.includes(startIndex)) {
          return { ...next, currentIndex: startIndex };
        }
        if (filter === "all") {
          const last = prev.currentIndex;
          return {
            ...next,
            currentIndex: indices.includes(last) ? last : indices[0],
          };
        }
        return { ...next, currentIndex: indices[0] };
      });
    },
    [],
  );

  const startExam = useCallback((fresh = true, options?: ExamStartOptions) => {
    setState((prev) => {
      if (!fresh && prev.exam && prev.exam.queue.length > 0) {
        const current = prev.exam.queue.includes(prev.currentIndex)
          ? prev.currentIndex
          : prev.exam.queue[0]!;
        return { ...prev, filter: "exam", currentIndex: current };
      }
      const groupIds = options ? (options.groupIds ?? []) : (prev.exam?.groupIds ?? []);
      const queue = pickRandomMuscleIndices(EXAM_SIZE, groupIds);
      if (queue.length === 0) {
        return prev;
      }
      return {
        ...prev,
        filter: "exam",
        exam: {
          queue,
          groupIds,
          answers: {},
          reviews: {},
          reveal: {},
          startedAt: Date.now(),
        },
        currentIndex: queue[0] ?? 0,
      };
    });
  }, []);

  const goHome = useCallback(() => {
    setState((prev) => ({ ...prev, mode: prev.mode }));
  }, []);

  const setField = useCallback(
    (muscleId: string, field: FieldKey, value: string) => {
      setState((prev) => {
        if (inExam(prev) && prev.exam) {
          const current = prev.exam.answers[muscleId] ?? emptyAnswers();
          return {
            ...prev,
            exam: {
              ...prev.exam,
              answers: {
                ...prev.exam.answers,
                [muscleId]: { ...current, [field]: value },
              },
            },
          };
        }
        const current = prev.answers[muscleId] ?? emptyAnswers();
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [muscleId]: { ...current, [field]: value },
          },
        };
      });
    },
    [],
  );

  const answersFor = useCallback(
    (muscleId: string) => getAnswers(state, muscleId),
    [state],
  );

  const saveReview = useCallback((muscleId: string, review: MuscleReview) => {
    setState((prev) => {
      if (inExam(prev) && prev.exam) {
        return {
          ...prev,
          exam: {
            ...prev.exam,
            reviews: { ...prev.exam.reviews, [muscleId]: review },
          },
        };
      }
      return {
        ...prev,
        reviews: { ...prev.reviews, [muscleId]: review },
      };
    });
  }, []);

  const toggleFlag = useCallback((muscleId: string) => {
    setState((prev) => {
      const has = prev.flagged.includes(muscleId);
      return {
        ...prev,
        flagged: has
          ? prev.flagged.filter((id) => id !== muscleId)
          : [...prev.flagged, muscleId],
      };
    });
  }, []);

  const clearAnswers = useCallback((muscleId: string) => {
    setState((prev) => {
      if (inExam(prev) && prev.exam) {
        const answers = { ...prev.exam.answers };
        delete answers[muscleId];
        const reviews = { ...prev.exam.reviews };
        delete reviews[muscleId];
        const reveal = { ...prev.exam.reveal };
        delete reveal[muscleId];
        return { ...prev, exam: { ...prev.exam, answers, reviews, reveal } };
      }
      const answers = { ...prev.answers };
      delete answers[muscleId];
      const reviews = { ...prev.reviews };
      delete reviews[muscleId];
      const reveal = { ...prev.reveal };
      delete reveal[muscleId];
      return { ...prev, answers, reviews, reveal };
    });
  }, []);

  const toggleReveal = useCallback((muscleId: string) => {
    setState((prev) => {
      if (inExam(prev) && prev.exam) {
        return {
          ...prev,
          exam: {
            ...prev.exam,
            reveal: { ...prev.exam.reveal, [muscleId]: !prev.exam.reveal[muscleId] },
          },
        };
      }
      return {
        ...prev,
        reveal: { ...prev.reveal, [muscleId]: !prev.reveal[muscleId] },
      };
    });
  }, []);

  const goToQueueIndex = useCallback(
    (position: number) => {
      setState((prev) => {
        const indices = filteredIndices(prev);
        if (indices.length === 0) return prev;
        const clamped = Math.min(Math.max(0, position), indices.length - 1);
        return { ...prev, currentIndex: indices[clamped] };
      });
    },
    [],
  );

  const goNext = useCallback(() => {
    setState((prev) => {
      const indices = filteredIndices(prev);
      if (indices.length === 0) return prev;
      const pos = indices.indexOf(prev.currentIndex);
      const nextPos = pos < 0 ? 0 : Math.min(pos + 1, indices.length - 1);
      return { ...prev, currentIndex: indices[nextPos] };
    });
  }, []);

  const goPrev = useCallback(() => {
    setState((prev) => {
      const indices = filteredIndices(prev);
      if (indices.length === 0) return prev;
      const pos = indices.indexOf(prev.currentIndex);
      const nextPos = pos < 0 ? 0 : Math.max(pos - 1, 0);
      return { ...prev, currentIndex: indices[nextPos] };
    });
  }, []);

  const value: StudyContextValue = {
    ready,
    state,
    stats,
    examStats,
    queue,
    queuePosition,
    muscleIndex,
    setMode,
    startStudy,
    startExam,
    goHome,
    setField,
    answersFor,
    saveReview,
    toggleFlag,
    clearAnswers,
    toggleReveal,
    goToQueueIndex,
    goNext,
    goPrev,
  };

  return createElement(StudyContext.Provider, { value }, children);
}

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}
