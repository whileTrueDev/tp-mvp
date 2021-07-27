import create from 'zustand';
import { CategoryInDB } from '../utils/hooks/query/useCreatorCategoryTab';

type Category = {
  categoryId: number,
  label: string
}

type ToptenFilterButtonState = {
  mainTabIndex: number,
  categoryTabIndex: number,
  platformTabIndex: number,
  weeklyGraphLabel: string,
  categoryTabColumns: Category[],
  changeCategory: (index: number) => void,
  changePlatform: (index: number) => void,
  changeMain: (index: number) => void,
  setCategoryTabColumns: (categories: CategoryInDB[]) => void,
  initializeCategoryTabColumns: () => void
}

export const useToptenFilterButtonStore = create<ToptenFilterButtonState>((set, get) => ({
  mainTabIndex: 0,
  categoryTabIndex: 0,
  platformTabIndex: 0,
  weeklyGraphLabel: '주간 점수 그래프',
  categoryTabColumns: [
    { categoryId: 0, label: '전체' },
  ],
  changeMain: (index) => {
    let weeklyGraphLabel = '';
    if (index === 0) {
      weeklyGraphLabel = '주간 시청자수 추이';
    } else if (index === 1) {
      weeklyGraphLabel = '일일 평균 평점 추이';
    } else {
      weeklyGraphLabel = '주간 점수 그래프';
    }
    set((state) => ({ ...state, mainTabIndex: index, weeklyGraphLabel }));
  },
  changePlatform: (index) => set((state) => ({ ...state, platformTabIndex: index })),
  changeCategory: (index) => set((state) => ({ ...state, categoryTabIndex: index })),
  setCategoryTabColumns: (categoriesFromDB) => {
    const categories = categoriesFromDB
      .map((c) => ({ categoryId: c.categoryId, label: c.name }));
    const newCategories = [...get().categoryTabColumns, ...categories];
    set((state) => ({ ...state, categoryTabColumns: newCategories }));
  },
  initializeCategoryTabColumns: () => set((state) => ({
    ...state,
    categoryTabColumns: [
      { categoryId: 0, label: '전체' },
    ],
  })),
}));
