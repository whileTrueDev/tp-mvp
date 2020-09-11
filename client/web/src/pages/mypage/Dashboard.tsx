import React from 'react';
import useTheme from '@material-ui/core/styles/useTheme';
import MypageSectionWrapper from '../../atoms/MypageSectionWrapper';
import SimpleNoticeTable from '../../organisms/mypage/dashboard/SimpleNoticeTable';
import UserMetrics from '../../organisms/mypage/dashboard/UserMetrics';

export default function Dashboard(): JSX.Element {
  const theme = useTheme();
  return (
    <>
      <MypageSectionWrapper color={theme.palette.info.light}>
        <UserMetrics />
      </MypageSectionWrapper>
      <MypageSectionWrapper>
        <SimpleNoticeTable />
        <SimpleNoticeTable />
        <SimpleNoticeTable />
      </MypageSectionWrapper>
    </>
  );
}
