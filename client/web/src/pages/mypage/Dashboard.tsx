import React from 'react';
import useAxios from 'axios-hooks';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserProfile from '../../organisms/mypage/dashboard/UserProfile';
import UserMetricsSection from '../../organisms/mypage/dashboard/UserMetricsSection';

export default function Dashboard(): JSX.Element {
  // Notice data
  const [{ loading, data }] = useAxios({
    url: '/notice/outline',
    method: 'GET',
    params: { important: 2 },
  });

  return (
    <>
      <MypageSectionWrapper style={{ minHeight: 300 }}>
        <UserProfile />
      </MypageSectionWrapper>

      <MypageSectionWrapper style={{ paddingTop: 0 }}>
        <UserMetricsSection />
      </MypageSectionWrapper>

      <MypageSectionWrapper style={{ paddingTop: 0 }}>
        <SimpleNoticeTable data={!loading && data ? data : []} />
      </MypageSectionWrapper>
    </>
  );
}
