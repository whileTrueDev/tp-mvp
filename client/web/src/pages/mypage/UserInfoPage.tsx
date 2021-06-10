import { Box, Container, Hidden } from '@material-ui/core';
import React from 'react';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../assets/constants';
import HeaderDecoration from '../../organisms/mainpage/ranking/sub/HeaderDecoration';
import PageTitle from '../../organisms/mainpage/shared/PageTitle';
// import UserProfile from '../../organisms/mypage/dashboard/UserProfile';
import MyRatings from '../../organisms/mypage/userInfo/MyRatings';
import UserSetting from '../../organisms/mypage/userInfo/UserSetting';
import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';

export default function UserInfoPage(): JSX.Element {
  return (
    <div>
      <Appbar />
      <Hidden smDown>
        <HeaderDecoration />
      </Hidden>

      <Container style={{ maxWidth: RANKING_PAGE_CONTAINER_WIDTH }}>
        <PageTitle text="내 프로필" />
        <Box mb={4}>
          <UserSetting />
        </Box>

        <MyRatings />
      </Container>

      <Footer />

    </div>
  );
}
