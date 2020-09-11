import React from 'react';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
// @material-ui/icons
import EventNote from '@material-ui/icons/EventNote';
// core components
import useNavbarStyles from './Navbar.style';
import HeaderLinks from './HeaderLinks';
import NavbarUserList from './NavbarUserList';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';

interface NavUserInfoInterface{
  username : string;
  subscribePerioud: string;
  isSubscribe: boolean;
  subscribeStartAt: Date;
  subscribeEndAt: Date;
}

export interface NavbarProps {
  navUserInfoList: NavUserInfoInterface[];
  routes: MypageRouteType[];
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const { navUserInfoList, routes } = props;
  const [selectedUserIndex, setSelectedUserIndex] = React.useState<number>(0);
  const currDate = new Date();

  // "~ 님" 클릭 드롭다운 선택 핸들러
  const handleSelectedUserIndex = (user: NavUserInfoInterface) => {
    setSelectedUserIndex(navUserInfoList.indexOf(user));
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>

        <Grid container justify="space-between" direction="row" xs={12}>
          <Grid item container md={10} direction="row" alignItems="flex-end" spacing={1}>
            {/* 사용중인 유저 이름 , 클릭시 구독 유저 드롭다운 리스트 */}
            <Grid item>
              <NavbarUserList
                selectedUserIndex={selectedUserIndex}
                handleSelectedUserIndex={handleSelectedUserIndex}
                navUserInfoList={navUserInfoList}
              />
            </Grid>

            {/* 구독 기간 , 선택된 유저의 구독 기간을 표기 */}
            <Grid item style={{ padding: 0 }}>
              <EventNote className={classes.leftGridIcon} />
            </Grid>

            {/* Case String Type */}
            {/* <Grid item>
              <Typography style={{ fontSize: '25px', textDecoration: 'underline' }}>
                {navUserInfoList[selectedUserIndex].subscribePerioud}
              </Typography>
            </Grid> */}

            {/* Case Date Type */}
            <Grid item>
              <Typography style={{ fontSize: '25px', textDecoration: 'underline' }}>
                {`${navUserInfoList[selectedUserIndex].subscribeStartAt.toLocaleDateString()}~
                ${navUserInfoList[selectedUserIndex].subscribeEndAt.toLocaleDateString()}`}
              </Typography>
            </Grid>

            <Grid item>
              {navUserInfoList[selectedUserIndex].subscribeEndAt
                >= currDate
                ? (
                  <Chip label="구독중" className={classes.subscribeChip} />
                ) : (
                  <Chip label="구독 만료" className={classes.notSubscribeChip} />
                )}
            </Grid>

          </Grid>
          <Grid item container md={2} alignContent="center">
            {/* 홈 아이콘 버튼 , 알림 아이콘 버튼 */}
            <HeaderLinks routes={routes} />
          </Grid>
        </Grid>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
