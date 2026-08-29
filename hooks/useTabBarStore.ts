import { create } from 'zustand';

interface TabBarState {
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
}

export const useTabBarStore = create<TabBarState>((set) => ({
  isTabBarVisible: true,
  setTabBarVisible: (visible) =>
    set((state) => (state.isTabBarVisible === visible ? state : { isTabBarVisible: visible })),
}));
