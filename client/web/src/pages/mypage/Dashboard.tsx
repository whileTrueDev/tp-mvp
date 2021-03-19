import React from 'react';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserProfile from '../../organisms/mypage/dashboard/UserProfile';
import UserMetricsSection from '../../organisms/mypage/dashboard/UserMetricsSection';
import useScrollTop from '../../utils/hooks/useScrollTop';

export default function Dashboard(): JSX.Element {
  // 처음 페이지 렌더링시 화면 최상단으로 스크롤이동

  useScrollTop();
  return (
    <>
      <MypageSectionWrapper>
        <UserProfile />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        <UserMetricsSection />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        <SimpleNoticeTable />
      </MypageSectionWrapper>
    </>
  );
}
