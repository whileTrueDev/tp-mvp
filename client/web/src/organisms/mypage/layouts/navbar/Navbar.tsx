import React from 'react';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
// @material-ui/icons
import EventNoteIcon from '@material-ui/icons/EventNote';
// axios
import { AxiosError } from 'axios';
// core components
import moment from 'moment';
import useNavbarStyles from './Navbar.style';
import HeaderLinks from './HeaderLinks';
import NavbarUserList from './NavbarUserList';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

interface NavUserInfoInterface{
  userId : string;
  targetUserId: string;
  startAt : Date;
  endAt : Date;
}
export interface NavbarProps {
  navUserInfoList: NavUserInfoInterface[];
  routes: MypageRouteType[];
  loading: boolean;
  error : AxiosError<any> | undefined;
  handleChangeCurrUser : (otheruser: string) => void;
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const {
    navUserInfoList, routes, loading, error, handleChangeCurrUser
  } = props;
  const [selectedUserIndex, setSelectedUserIndex] = React.useState<number>(0);
  const currDate = new Date();

  // "~ 님" 클릭 드롭다운 선택 핸들러
  const handleSelectedUserIndex = (user: NavUserInfoInterface) => {
    setSelectedUserIndex(navUserInfoList.indexOf(user));
    handleChangeCurrUser(navUserInfoList[navUserInfoList.indexOf(user)].targetUserId);
  };

  return (
    <AppBar className={classes.appBar}>

      {!loading && !error ? (
        <Toolbar className={classes.container}>
          {navUserInfoList.length > 0 ? (
            <Grid container justify="space-between" direction="row">
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
                {/* Case Date Type */}
                <Grid item className={classes.subscribePeriod}>
                  <EventNoteIcon
                    className={classes.leftGridIcon}
                    style={{ padding: 0, margin: 0 }}
                  />
                  <Typography variant="h5">
                    {`${moment(navUserInfoList[selectedUserIndex].startAt).format('YYYY-MM-DD')} ~
                      ${moment(navUserInfoList[selectedUserIndex].endAt).format('YYYY-MM-DD')}`}
                  </Typography>
                </Grid>

                <Grid item>
                  {moment(navUserInfoList[selectedUserIndex].endAt)
                    >= moment(currDate.toISOString())
                    ? (
                      <Chip label="구독중" className={classes.subscribeChip} />
                    ) : (
                      <Chip label="구독 만료" className={classes.notSubscribeChip} />
                    )}
                </Grid>

              </Grid>
              <Grid item container md={2} alignContent="center">
                {/* 홈 아이콘 버튼 , 알림 아이콘 버튼 */}
                <HeaderLinks
                  routes={routes}
                  userId={navUserInfoList[selectedUserIndex].userId}
                />
              </Grid>
            </Grid>

          ) : (
            <Grid container justify="space-between" direction="row">
              <Typography>
                구독한 유저가 없습니다.
              </Typography>
            </Grid>
          )}
        </Toolbar>
      ) : (
        <CenterLoading />
      )}

    </AppBar>
  );
}

export default Navbar;
