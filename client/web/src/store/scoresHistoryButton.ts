import create from 'zustand';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ScoreHistoryData } from '@truepoint/shared/dist/res/CreatorRatingResType.interface';
import { Icons } from '../organisms/mainpage/ranking/ToptenCard';

export type ScoresHistoryControlButton = {
  key: keyof ScoreHistoryData,
  label: string,
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
}
// 그래프 바꾸는 버튼
export const buttons: ScoresHistoryControlButton[] = [
  { key: 'viewer' as const, label: '최고 시청자 수' },
  { key: 'rating' as const, label: '시청자 평점' },
  { key: 'admire' as const, label: '감탄점수' },
  { key: 'smile' as const, label: '웃음점수' },
  { key: 'frustrate' as const, label: '답답함점수' },
  { key: 'cuss' as const, label: '욕점수' },
].map((button) => ({ ...button, icon: Icons[button.key] }));

type ScoresHistoryButtonState = {
  selectedButton: ScoresHistoryControlButton
  changeButton: (button: ScoresHistoryControlButton) => void
}
export const useScoresHistoryButton = create<ScoresHistoryButtonState>((set) => ({
  selectedButton: buttons[0],
  changeButton: (button) => set((state) => ({ ...state, selectedButton: button })),
}));
