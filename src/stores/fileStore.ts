import { create } from 'zustand'
import type { DriveItem, BreadcrumbItem } from '@/types'

interface FileState {
  currentCid: string
  items: DriveItem[]
  breadcrumbs: BreadcrumbItem[]
  selectedIds: Set<string>
  viewMode: 'list' | 'grid'
  sortOrder: { field: string; asc: boolean }
  isLoading: boolean
  searchQuery: string
  setCid: (cid: string, name?: string) => void
  setItems: (items: DriveItem[]) => void
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  navigateTo: (cid: string, name: string) => void
  navigateBack: (targetIndex: number) => void
  toggleSelect: (id: string) => void
  clearSelection: () => void
  setViewMode: (mode: 'list' | 'grid') => void
  setSortOrder: (field: string, asc: boolean) => void
  setLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
}

export const useFileStore = create<FileState>((set, get) => ({
  currentCid: '0',
  items: [],
  breadcrumbs: [{ cid: '0', name: '全部文件' }],
  selectedIds: new Set(),
  viewMode: 'list',
  sortOrder: { field: 'file_name', asc: true },
  isLoading: false,
  searchQuery: '',

  setCid: (cid) => set({ currentCid: cid }),

  setItems: (items) => set({ items }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  navigateTo: (cid, name) => {
    const { breadcrumbs } = get()
    set({
      currentCid: cid,
      breadcrumbs: [...breadcrumbs, { cid, name }],
      selectedIds: new Set(),
    })
  },

  navigateBack: (targetIndex) => {
    const { breadcrumbs } = get()
    const newBreadcrumbs = breadcrumbs.slice(0, targetIndex + 1)
    set({
      currentCid: newBreadcrumbs[newBreadcrumbs.length - 1].cid,
      breadcrumbs: newBreadcrumbs,
      selectedIds: new Set(),
    })
  },

  toggleSelect: (id) => {
    const { selectedIds } = get()
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    set({ selectedIds: newSet })
  },

  clearSelection: () => set({ selectedIds: new Set() }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSortOrder: (field, asc) => set({ sortOrder: { field, asc } }),

  setLoading: (loading) => set({ isLoading: loading }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}))
