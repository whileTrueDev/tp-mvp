import React from 'react';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// @material-ui/icons
import EventNote from '@material-ui/icons/EventNote';
import Menu from '@material-ui/icons/Menu';
// core components
import useNavbarStyles from './Navbar.style';
// import Button from '../../../../atoms/CustomButtons/Button';
import AdminNavbarLinks from './AdminNavbarLinks';
import NavbarUserList from './NavbarUserList';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';

export interface NavbarProps {
  routes: MypageRouteType[];
  handleDrawerToggle: () => void;
}

interface NavUserInfoInterface{
  username : string;
  subscribePerioud: string;
  // isSubscribe: boolean;
}

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const { routes, handleDrawerToggle } = props;
  const [selectedUserIndex, setSelectedUserIndex] = React.useState<number>(0);
  const [navUserInfoList, setNavUserInfoList] = React.useState<NavUserInfoInterface[]>([
    {
      username: 'aaaaaaaaa', subscribePerioud: '2019-09-01 ~ 2019-09-30',
    },
    {
      username: 'bbbbbbbbb', subscribePerioud: '2019-09-01 ~ 2110-09-30',
    },
    {
      username: 'ccccccccc', subscribePerioud: '2019-09-01 ~ 2222-09-30',
    },
    {
      username: 'ddddddddd', subscribePerioud: '2019-09-01 ~ 3333-09-30',
    },
  ]);

  const handleSelectedUserIndex = (user: NavUserInfoInterface) => {
    setSelectedUserIndex(navUserInfoList.indexOf(user));
  };

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <Grid container justify="space-between" direction="row">
          <Grid container item direction="row" xs={10} spacing={2} justify="flex-start" alignItems="flex-end">
            {/* 사용중인 유저 이름 , 드롭다운 리스트로 구독중인 다른 유저 목록 선택 가능하도록 해야함 */}
            <Grid item>
              <NavbarUserList
                selectedUserIndex={selectedUserIndex}
                handleSelectedUserIndex={handleSelectedUserIndex}
                navUserInfoList={navUserInfoList}
              />
            </Grid>

            {/* 구독 기간 , 선택된 유저의 구독 기간을 표기 */}
            <Grid item>
              <EventNote />
            </Grid>

            <Grid item>
              <Typography variant="subtitle1">
                {navUserInfoList[selectedUserIndex].subscribePerioud}
              </Typography>
            </Grid>

          </Grid>
          <Grid container item xs={2}>
            {/* 홈 아이콘 버튼 , 알림 아이콘 버튼 */}

            <AdminNavbarLinks />

            <Hidden mdUp implementation="css">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
              >
                <Menu />
              </IconButton>
            </Hidden>

          </Grid>
        </Grid>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
