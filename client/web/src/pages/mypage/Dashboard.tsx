import React from 'react';
// import useAxios from 'axios-hooks';
import useTheme from '@material-ui/core/styles/useTheme';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserMetrics from '../../organisms/mypage/dashboard/UserMetrics';

export default function Dashboard(): JSX.Element {
  const theme = useTheme();

  // const [{ loading, data, error }] = useAxios(
  //   {
  //     url: '/stream-analysis/user-statistics',
  //     params: {
  //       userId: 'userId1', nowDate: '2020-09-18T03:33:04.597Z'
  //     }
  //   },
  // );

  return (
    <>
      <MypageSectionWrapper color={theme.palette.info.light} style={{ minHeight: 300 }}>
        <UserMetrics />
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <SimpleNoticeTable />
      </MypageSectionWrapper>
    </>
  );
}
