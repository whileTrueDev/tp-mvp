import React from 'react';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserProfile from '../../organisms/mypage/dashboard/UserProfile';
import UserMetricsSection from '../../organisms/mypage/dashboard/UserMetricsSection';

export default function Dashboard(): JSX.Element {
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
