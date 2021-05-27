import { RankingDataType } from '@truepoint/shared/dist/res/RankingsResTypes.interface';
import React, {
  useState, useCallback, useMemo,
} from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import useAxios, { RefetchOptions } from 'axios-hooks';
import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import axios from '../axios';
import AdmireIcon from '../../atoms/svgIcons/AdmireIcon';
import CussIcon from '../../atoms/svgIcons/CussIcon';
import FrustratedIcon from '../../atoms/svgIcons/FrustratedIcon';
import SmileIcon from '../../atoms/svgIcons/SmileIcon';
import TVIcon from '../../atoms/svgIcons/TVIcon';

export type MainTabName = 'admire'|'smile'|'cuss'|'frustrate'|'viewer'|'rating';
type MainTabColumns = {
  column: MainTabName;
  label: string;
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  className?: string
}

// 탭목록
const mainTabColumns: MainTabColumns[] = [
  { column: 'viewer', label: '최고 시청자수', icon: <TVIcon /> },
  { column: 'rating', label: '시청자 평점', icon: <StarBorderIcon /> },
  { column: 'admire', label: '감탄점수', icon: <AdmireIcon /> },
  { column: 'smile', label: '웃음점수', icon: <SmileIcon /> },
  { column: 'frustrate', label: '답답함점수', icon: <FrustratedIcon /> },
  { column: 'cuss', label: '욕점수', icon: <CussIcon /> },
];

type PlatformFilterType = 'all' | 'twitch' | 'afreeca';
// 플랫폼 필터 탭 목록
const platformTabColumns: {label: string, platform: PlatformFilterType}[] = [
  { label: '전체', platform: 'all' },
  { label: '아프리카', platform: 'afreeca' },
  { label: '트위치', platform: 'twitch' },
];

type loadDataArgs = {
  column: MainTabName;
  categoryId: number;
  platform: PlatformFilterType;
}
export default function useRankingState(): {
        currentMainTab: MainTabColumns,
        currentCategoryTab: {
          categoryId: number;
          label: string;
      },
        currentPlatformTab: {
          label: string;
          platform: PlatformFilterType;
      },
      loading: boolean,
      error: AxiosError<any> | undefined,
      dailyRatingLoading: boolean,
      dailyRatingError: AxiosError<any> | undefined,
      recentAnalysisDate: Date|undefined,
      weeklyGraphLabel: string,
      tabChangeLoading: boolean,
      changeMain: (index: number) => void,
      changeCategory: (index: number) => void,
      changePlatform: (index: number) => void,
      loadData: (args: loadDataArgs) => void,
      loadMoreData: () => void,
      loadCategories: () => void,
      dataToDisplay: RankingDataType,
      mainTabIndex: number,
      categoryTabIndex: number,
      platformTabIndex: number,
      } {
  // axios요청
  // 탭 별 상위 10인 요청
  const [{ loading, error }, refetch] = useAxios<RankingDataType>({
    url: '/rankings/top-ten',
  }, { manual: true });
  // 시청자 평점 탭(일일평점) 요청
  const [{
    loading: dailyRatingLoading,
    error: dailyRatingError,
  }, getDailyRatingData] = useAxios<RankingDataType>({
    url: '/ratings/daily-ranking',
  }, { manual: true });

  // 최근 분석날짜 요청
  const [{ data: recentAnalysisDate },
  ] = useAxios<Date>('/rankings/recent-analysis-date');

  // states
  // 메인 탭에서 선택된 탭의 인덱스
  const [mainTabIndex, setMainTabIndex] = useState<number>(0);
  // 하위카테고리 탭에서 선택된 탭의 인덱스
  const [categoryTabIndex, setCategoryTabIndex] = useState<number>(0);
  // 플랫폼 탭에서 선택된 탭의 인덱스
  const [platformTabIndex, setPlatformTabIndex] = useState<number>(0);
  // 랭킹목록 순위, 이름, 다음에 나오는 '주간 점수 그래프 | 주간 시청자수 그래프' 부분
  const [weeklyGraphLabel, setWeeklyGraphLabel] = useState<string>('주간 점수 그래프');
  // 보여줄 데이터 상태
  const [dataToDisplay, setDataToDisplay] = useState<RankingDataType>({
    rankingData: [],
    weeklyTrends: {},
    totalDataCount: 0,
  });
  // 탭변경 로딩
  const [tabChangeLoading, setTabChangeLoading] = useState<boolean>(false);
  // 카테고리 컬럼
  const [categoryTabColumns, setCategoryTabColumns] = useState<{categoryId: number, label: string}[]>([
    { categoryId: 0, label: '전체' },
  ]);

  // 메서드
  // 데이터요청
  const loadData = useCallback((args: loadDataArgs) => {
    const { column, categoryId, platform } = args;
    let request: (config?: AxiosRequestConfig | undefined,
      options?: RefetchOptions | undefined) => AxiosPromise<RankingDataType>;
    setTabChangeLoading(true);

    if (column === 'rating') {
      request = getDailyRatingData;
    } else {
      request = refetch;
    }
    request({
      params: {
        column,
        skip: 0,
        categoryId,
        platform,
      },
    }).then((res) => {
      console.log(res.data);
      setDataToDisplay(res.data);
      setTabChangeLoading(false);
    }).catch((e) => {
      console.error(e);
      setTabChangeLoading(false);
    });
  }, [getDailyRatingData, refetch]);

  const changeMain = useCallback((index: number) => {
    setMainTabIndex(index);
    const { column } = mainTabColumns[index];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[platformTabIndex];
    loadData({ column, categoryId, platform });

    if (column === 'viewer') {
      setWeeklyGraphLabel('주간 시청자수 추이');
    } else if (column === 'rating') {
      setWeeklyGraphLabel('일일 평균 평점 추이');
    } else {
      setWeeklyGraphLabel('주간 점수 그래프');
    }
  }, [categoryTabColumns, categoryTabIndex, loadData, platformTabIndex]);

  const changeCategory = useCallback((index: number) => {
    setCategoryTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[index];
    const { platform } = platformTabColumns[platformTabIndex];

    loadData({ column, categoryId, platform });
  }, [categoryTabColumns, loadData, mainTabIndex, platformTabIndex]);

  const changePlatform = useCallback((index: number) => {
    setPlatformTabIndex(index);
    const { column } = mainTabColumns[mainTabIndex];
    const { categoryId } = categoryTabColumns[categoryTabIndex];
    const { platform } = platformTabColumns[index];

    loadData({ column, categoryId, platform });
  }, [categoryTabColumns, categoryTabIndex, loadData, mainTabIndex]);

  const loadMoreData = useCallback(() => {
    let request: (config?: AxiosRequestConfig | undefined,
      options?: RefetchOptions | undefined) => AxiosPromise<RankingDataType>;

    if (mainTabColumns[mainTabIndex].column === 'rating') {
      request = getDailyRatingData;
    } else {
      request = refetch;
    }
    request({
      params: {
        column: mainTabColumns[mainTabIndex].column,
        skip: dataToDisplay.rankingData.length,
        categoryId: categoryTabColumns[categoryTabIndex].categoryId,
        platform: platformTabColumns[platformTabIndex].platform,
      },
    }).then((res) => {
      const newData = res.data;
      setDataToDisplay((prev) => ({
        rankingData: [...prev.rankingData, ...newData.rankingData],
        weeklyTrends: { ...prev.weeklyTrends, ...newData.weeklyTrends },
        totalDataCount: newData.totalDataCount,
      }));
    }).catch((e) => {
      console.error(e);
    });
  }, [categoryTabColumns, categoryTabIndex, dataToDisplay.rankingData.length,
    getDailyRatingData, mainTabIndex, platformTabIndex, refetch]);

  const loadCategories = () => {
    axios.get('/creator-category')
      .then((res) => {
        const data = res.data.map((d: {categoryId: number; name: string;}) => (
          { categoryId: d.categoryId, label: d.name }
        ));
        setCategoryTabColumns((prev) => ([...prev, ...data]));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const currentMainTab = useMemo(() => mainTabColumns[mainTabIndex], [mainTabIndex]);
  const currentCategoryTab = useMemo(() => categoryTabColumns[categoryTabIndex],
    [categoryTabColumns, categoryTabIndex]);
  const currentPlatformTab = useMemo(() => platformTabColumns[platformTabIndex], [platformTabIndex]);
  return {
    currentMainTab,
    currentCategoryTab,
    currentPlatformTab,
    loading,
    error,
    dailyRatingLoading,
    dailyRatingError,
    recentAnalysisDate,
    weeklyGraphLabel,
    tabChangeLoading,
    changeMain,
    changeCategory,
    changePlatform,
    loadData,
    loadMoreData,
    loadCategories,
    dataToDisplay,
    mainTabIndex,
    categoryTabIndex,
    platformTabIndex,

  };
}
