import { create } from 'zustand';

export type JobStatus = 'processing' | 'success' | 'error';

export interface BackgroundJob {
  id: string;
  title: string;
  status: JobStatus;
  resultUrl?: string;
  errorMessage?: string;
  createdAt: number;
}

interface BackgroundJobStore {
  jobs: BackgroundJob[];
  addJob: (job: Omit<BackgroundJob, 'createdAt'>) => void;
  updateJob: (id: string, updates: Partial<BackgroundJob>) => void;
  removeJob: (id: string) => void;
  clearAll: () => void;
}

export const useBackgroundJobStore = create<BackgroundJobStore>((set) => ({
  jobs: [],
  addJob: (job) =>
    set((state) => ({
      // Thêm job mới lên đầu danh sách
      jobs: [{ ...job, createdAt: Date.now() }, ...state.jobs],
    })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    })),
  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),
  clearAll: () => set({ jobs: [] }),
}));
