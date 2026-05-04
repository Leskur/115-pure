import { create } from 'zustand'
import type { TransferTask } from '@/types'

interface TransferState {
  tasks: TransferTask[]
  addTask: (task: TransferTask) => void
  updateTask: (id: string, updates: Partial<TransferTask>) => void
  removeTask: (id: string) => void
  clearCompleted: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  tasks: [],

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  clearCompleted: () =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.status !== 'done') })),
}))
