import React from 'react';
// @material-ui/core components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// @material-ui/icons
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

function Navbar(props: NavbarProps): JSX.Element {
  const classes = useNavbarStyles();
  const { routes, handleDrawerToggle } = props;
  const [username, setUsername] = React.useState('누구누구님'); // 선택한 유저 이름
  const [subscribePerioud, setSubscribePerioud] = React.useState('2019-09-01 ~ 2019-09-30'); // 선택한 유저의 구독 기간
  const [isSubscribe, setIsSubscribe] = React.useState(true); // 선택한 유저의 구독 여부

  // 유저명 - 구독기간 - 구독 여부 를 하나의 자료형으로 생각 하면 , 
  // 최초 해당 자료형 리스트에서 로그인한 유저명 - 구독기간 - 구독 여부 를 최초 보여주고
  // 이름 클릭시 보여주는 드롭다운 리스트에서 선택시 해당 유저의 구독한 유저명 - 구독기간 - 구독 여부?

  const [userList, setUserList] = React.useState(['a', 'b', 'c']);

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.container}>
        <Grid container justify="space-between" direction="row">
          <Grid container item direction="row" xs={10} spacing={2} justify="flex-start" alignItems="flex-end">
            {/* 사용중인 유저 이름 , 드롭다운 리스트로 구독중인 다른 유저 목록 선택 가능하도록 해야함 */}
            <Grid item>
              <NavbarUserList
                userList={userList}
              />
            </Grid>

            {/* 구독 기간 , 선택된 유저의 구독 기간을 표기 */}
            <Grid item>
              <Typography variant="subtitle1">
                {subscribePerioud}
              </Typography>
            </Grid>

            {/* 구독 상태 여부 표시 - 구독중 or 미구독 */}
            <Grid item>
              <Typography variant="subtitle1">
                {isSubscribe ? '구독중' : '미구독'}
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

// <AppBar className={classes.appBar}>
//       <Toolbar className={classes.container}>
//         <div className={classes.flex}>
//           {makeBrand() ? (
//             <Button color="default" variant="text" href="#" className={classes.title}>
//               {makeBrand()}
//             </Button>
//           ) : (null)}
//         </div>

//         <AdminNavbarLinks />

//         <Hidden mdUp implementation="css">
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             onClick={handleDrawerToggle}
//           >
//             <Menu />
//           </IconButton>
//         </Hidden>
//       </Toolbar>
//     </AppBar>
