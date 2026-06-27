import { create } from 'zustand'

/**
 * Global UI state (Zustand).
 *
 * Holds cross-cutting *view* state that is not server data — e.g. whether the
 * navigation sidebar is open. Server state belongs in TanStack Query, not here.
 * This store is a wiring example/pattern; business state arrives in later phases.
 */
interface UiState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
