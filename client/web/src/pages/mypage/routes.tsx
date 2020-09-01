import { SvgIconProps } from '@material-ui/core/SvgIcon';
// Material Icons
import Dashboard from '@material-ui/icons/DashboardOutlined';
import Person from '@material-ui/icons/PersonOutline';
import BrandingWatermark from '@material-ui/icons/BrandingWatermarkOutlined';
import Reorder from '@material-ui/icons/Reorder';
import Work from '@material-ui/icons/Work';

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
    path: '/',
    name: '대시보드',
    icon: Dashboard,
    // component: CreatorDashboard, // 해당 페이지 컴포넌트를 여기에
    layout: '/mypage',
  },
  {
    path: '/highlight',
    name: '편집점 분석',
    icon: BrandingWatermark,
    // component: CreatorCampaignManage, // 해당 페이지 컴포넌트를 여기에
    layout: '/mypage',
  },
  {
    path: '/stream-analysis',
    name: '방송 분석',
    icon: Work,
    layout: '/mypage',
    nested: true,
    subRoutes: [
      {
        path: '/stream',
        name: '방송별 비교',
        layout: '/mypage/stream-analysis',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/period',
        name: '기간 추세 분석',
        layout: '/mypage/stream-analysis',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/period-vs-period',
        name: '기간 대 기간 분석',
        layout: '/mypage/stream-analysis',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
    ]
  },
  {
    path: '/channel-analysis',
    name: '채널 분석',
    icon: Reorder,
    layout: '/mypage',
    nested: true,
    subRoutes: [
      {
        path: '/video',
        name: '동영상별 비교',
        layout: '/mypage/channel-analysis',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/period',
        name: '기간별 분석',
        layout: '/mypage/channel-analysis',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
    ]
  },
  {
    path: '/settings',
    name: '내 정보 관리',
    layout: '/mypage',
    icon: Person,
    nested: true,
    subRoutes: [
      {
        path: '/user',
        name: '내 계정 정보 관리',
        layout: '/mypage/settings',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
      {
        path: '/subscribe',
        name: '구독 관리',
        layout: '/mypage/settings',
        // component: // 해당 페이지 컴포넌트를 여기에
      },
    ]
  }
];

export default dashboardRoutes;
