import {
  Box, Container, Grid, Hidden,
} from '@material-ui/core';
import React from 'react';
import { RANKING_PAGE_CONTAINER_WIDTH } from '../../assets/constants';
import HeaderDecoration from '../../organisms/mainpage/ranking/sub/HeaderDecoration';
import PageTitle from '../../organisms/mainpage/shared/PageTitle';
import MyComments from '../../organisms/mypage/userInfo/MyComments';
import MyPosts from '../../organisms/mypage/userInfo/MyPosts';
import MyRatings from '../../organisms/mypage/userInfo/MyRatings';
import LoginUserProfile from '../../organisms/mypage/userInfo/LoginUserProfile';
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
          <LoginUserProfile />
        </Box>
        <MyRatings />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <MyPosts />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MyComments />
          </Grid>
        </Grid>

      </Container>

      <Footer />

    </div>
  );
}
