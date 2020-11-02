import React from 'react';
// import moment from 'moment';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// import Chip from '@material-ui/core/Chip';
// @material-ui/icons
// import EventNoteIcon from '@material-ui/icons/EventNote';
// core components 
import useNavbarStyles from './Navbar.style';
import NavbarUserList from './NavbarUserList';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

export interface SubscribeUserInfo {
  userId: string;
  targetUserId: string;
  startAt: string;
  endAt: string;
}
export interface NavbarProps {
  routes: MypageRouteType[];
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const subscribe = React.useContext(SubscribeContext);

  // const currDate = new Date();

  return (
    <div className={classes.appBarWrapper}>
      <AppBar className={classes.appBar} color="primary" position="fixed">

        <Toolbar className={classes.container}>
          <div className={classes.sidebarPlaceholder} />
          {!subscribe.loading && !subscribe.error ? (

            <Grid container justify="space-between" direction="row">
              <Grid item container md={10} direction="row" alignItems="flex-end" spacing={1}>
                { subscribe.validSubscribeUserList
              && subscribe.validSubscribeUserList.length > 0
              && (
                <>

                    {/* 사용중인 유저 이름 , 클릭시 구독 유저 드롭다운 리스트 -> CBT 임시 주석 처리 */}
                  <NavbarUserList />

                  {/* 구독 기간 , 선택된 유저의 구독 기간을 표기 -> CBT 임시 주석 처리 */}
                  {/* <Grid item className={classes.subscribePeriod}>
                    <EventNoteIcon
                      className={classes.leftGridIcon}
                      style={{ padding: 0, margin: 0 }}
                    />
                    <Typography variant="h5">
                      {`${moment(subscribe.currUser.startAt).format('YYYY-MM-DD')} ~
                    ${moment(subscribe.currUser.endAt).format('YYYY-MM-DD')}`}
                    </Typography>
                  </Grid> */}

                  {/* 구독 중 뱃지 -> CBT 임시 주석 처리 */}
                  {/* <Grid item>
                    {moment(subscribe.currUser.endAt)
                  >= moment(currDate.toISOString())
                      ? (
                        <Chip label="구독중" className={classes.subscribeChip} />
                      ) : (
                        <Chip label="구독 만료" className={classes.notSubscribeChip} />
                      )}
                  </Grid> */}
                </>
              )}
              </Grid>
            </Grid>

          ) : (
            <CenterLoading />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
