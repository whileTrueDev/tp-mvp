import { SvgIconProps } from '@material-ui/core/SvgIcon';

// atoms SvgIcons
import DashboardIcon from '../../atoms/sidebar-icons/DashboardIcon';
import EditPointAnalysisIcon from '../../atoms/sidebar-icons/EditPointAnalysisIcon';
import MyInfoIcon from '../../atoms/sidebar-icons/MyInfoIcon';
import StreamAnalysisIcon from '../../atoms/sidebar-icons/StreamAnalysisIcon';
import ChannelAnalysisIcon from '../../atoms/sidebar-icons/ChannelAnalysisIcon';

// Page Components
import Dashboard from './Dashboard';
import HighlightAnalysis from './highlight-analysis/HighlightAnalysis';
import StreamAnalysis from './stream-analysis/StreamAnalysis';
import PeriodAnalysis from './stream-analysis/PeriodAnalysis';
import PeriodVsPeriodAnalysis from './stream-analysis/PeriodVsPeriodAnalysis';
import VideoAnalysis from './channel-analysis/VideoAnalysis';
import Settings from './my-office/Settings';
import Subscribe from './my-office/Subscribe';

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
    layout: '/mypage',
  },
  {
    path: '/highlight',
    name: '편집점 분석',
    icon: EditPointAnalysisIcon,
    component: HighlightAnalysis, // 해당 페이지 컴포넌트를 여기에
    layout: '/mypage',
  },
  {
    path: '/stream-analysis',
    name: '방송 분석',
    icon: StreamAnalysisIcon,
    layout: '/mypage',
    nested: true,
    subRoutes: [
      {
        path: '/each-stream',
        name: '방송별 비교',
        layout: '/mypage/stream-analysis',
        component: StreamAnalysis, // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/period',
        name: '기간 추세 분석',
        layout: '/mypage/stream-analysis',
        component: PeriodAnalysis// 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/term-to-term',
        name: '기간 대 기간 분석',
        layout: '/mypage/stream-analysis',
        component: PeriodVsPeriodAnalysis// 해당 페이지 컴포넌트를 여기에
      },
    ]
  },
  {
    path: '/channel-analysis',
    name: '채널 분석',
    icon: ChannelAnalysisIcon,
    layout: '/mypage',
    nested: true,
    subRoutes: [
      {
        path: '/video',
        name: '동영상별 비교',
        layout: '/mypage/channel-analysis',
        component: VideoAnalysis // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/each-perioud',
        name: '기간별 분석',
        layout: '/mypage/channel-analysis',
        component: PeriodAnalysis// 해당 페이지 컴포넌트를 여기에
      },
    ]
  },
  {
    path: '/my-office',
    name: '내 정보 관리',
    layout: '/mypage',
    icon: MyInfoIcon,
    nested: true,
    subRoutes: [
      {
        path: '/settings',
        name: '내 계정 정보 관리',
        layout: '/mypage/my-office',
        component: Settings// 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/subscribe',
        name: '구독 관리',
        layout: '/mypage/my-office',
        component: Subscribe// 해당 페이지 컴포넌트를 여기에
      },
    ]
  },
];

export default dashboardRoutes;
