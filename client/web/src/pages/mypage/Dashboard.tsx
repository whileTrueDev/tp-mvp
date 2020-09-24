import React from 'react';
import useAxios from 'axios-hooks';
import useTheme from '@material-ui/core/styles/useTheme';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserMetricsSection from '../../organisms/mypage/dashboard/UserMetricsSection';

export default function Dashboard(): JSX.Element {
  const theme = useTheme();

  // Notice data
  const [{ loading, data }] = useAxios({
    url: '/notice/outline',
    method: 'GET',
    params: { important: 2, newOne: 3 }
  });

  return (
    <>
      <MypageSectionWrapper color={theme.palette.info.light} style={{ minHeight: 300 }}>
        <UserMetricsSection />
      </MypageSectionWrapper>

      <MypageSectionWrapper>
        <SimpleNoticeTable data={!loading && data ? data : []} />
      </MypageSectionWrapper>
    </>
  );
}
