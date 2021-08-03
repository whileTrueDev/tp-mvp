import create from 'zustand';

export type FilterType = 'all'|'notice'|'recommended';
export type BoardPlatform = 'free' | 'afreeca' | 'twitch';

type CommunityBoardState = {
  tabValue: number,
  currentPlatform: BoardPlatform,
  filter: {
    free: FilterType,
    afreeca: FilterType,
    twitch: FilterType,
  },
}

type CommunityBoardStateWithActions = {
  changePlatform: (tabIndex: number) => void,
  changeFilter: (platform: BoardPlatform, filter: FilterType) => void,
  changeAfreecaToRecommended: () => Promise<void>,
  changeTwitchToRecommended: () => Promise<void>,
} & CommunityBoardState;

const defaultState: CommunityBoardState = {
  tabValue: 0,
  currentPlatform: 'free',
  filter: {
    free: 'all',
    afreeca: 'all',
    twitch: 'all',
  },
};

export const useCommunityBoardState = create<CommunityBoardStateWithActions>((set, get) => ({
  ...defaultState,
  changePlatform: (tabIndex: number) => {
    let currentPlatform: BoardPlatform;
    if (tabIndex === 0) {
      currentPlatform = 'free';
    } else if (tabIndex === 1) {
      currentPlatform = 'afreeca';
    } else if (tabIndex === 2) {
      currentPlatform = 'twitch';
    }
    set((state) => ({
      ...state,
      currentPlatform,
      tabValue: tabIndex,
      filter: { ...state.filter, [currentPlatform]: 'all' },
    }));
  },
  changeFilter: (platform: BoardPlatform, filter: FilterType) => {
    set((state) => ({ ...state, filter: { ...state.filter, [platform]: filter } }));
  },
  changeAfreecaToRecommended: () => {
    set((state) => ({
      ...state,
      currentPlatform: 'afreeca',
      tabValue: 1,
      filter: { ...state.filter, afreeca: 'recommended' },
    }));
    return Promise.resolve();
  },
  changeTwitchToRecommended: () => {
    set((state) => ({
      ...state,
      currentPlatform: 'twitch',
      tabValue: 2,
      filter: { ...state.filter, twitch: 'recommended' },
    }));
    return Promise.resolve();
  },

}));
