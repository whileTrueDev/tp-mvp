import { SvgIconProps } from '@material-ui/core/SvgIcon';

// atoms SvgIcons
import DashboardIcon from '../../../../atoms/sidebar-icons/DashboardIcon';
import EditPointAnalysisIcon from '../../../../atoms/sidebar-icons/EditPointAnalysisIcon';
import StreamAnalysisIcon from '../../../../atoms/sidebar-icons/StreamAnalysisIcon';
import Dashboard from '../../../../pages/mypage/Dashboard';
import HighlightAnalysis from '../../../../pages/mypage/highlight-analysis/HighlightAnalysis';
import StreamAnalysis from '../../../../pages/mypage/stream-analysis/StreamAnalysis';
import PeriodAnalysis from '../../../../pages/mypage/stream-analysis/PeriodAnalysis';
import PeriodVsPeriodAnalysis from '../../../../pages/mypage/stream-analysis/PeriodVsPeriodAnalysis';

export interface MypageRoute {
  path: string;
  name: string;
  layout: string;
  icon?: (props: SvgIconProps) => JSX.Element;
  component?: () => JSX.Element;
  noTab?: boolean; // sidebar에 나타나는가?
  nested?: boolean; // 하위 라우트가 있는가?
  subRoutes?: MypageRoute[]; // 하위 라우트의 정보
}

const dashboardRoutes: MypageRoute[] = [
  {
    path: '/main',
    name: '대시보드',
    icon: DashboardIcon,
    component: Dashboard, // 해당 페이지 컴포넌트를 여기에
    layout: '/public-mypage',
  },
  {
    path: '/highlight',
    name: '편집점 분석',
    icon: EditPointAnalysisIcon,
    component: HighlightAnalysis, // 해당 페이지 컴포넌트를 여기에
    layout: '/public-mypage',
  },
  {
    path: '/stream-analysis',
    name: '방송 분석',
    icon: StreamAnalysisIcon,
    layout: '/public-mypage',
    nested: true,
    subRoutes: [
      {
        path: '/each-stream',
        name: '방송별 비교',
        layout: '/public-mypage',
        component: StreamAnalysis, // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/period',
        name: '기간 추세 분석',
        layout: '/public-mypage',
        component: PeriodAnalysis, // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/term-to-term',
        name: '기간 대 기간 분석',
        layout: '/public-mypage',
        component: PeriodVsPeriodAnalysis, // 해당 페이지 컴포넌트를 여기에
      },
    ],
  },
];

export default dashboardRoutes;
