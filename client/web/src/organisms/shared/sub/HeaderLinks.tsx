import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import Home from '@material-ui/icons/Home';
// axios-hooks
import useAxios from 'axios-hooks';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
// notificaiton list component
import NotificationPopper from './NotificationPopper';
// style
// import useNavbarStyles from './Navbar.style';
// type
import { MypageRoute as MypageRouteType } from '../../../pages/mypage/routes';
// context
import useAuthContext from '../../../utils/hooks/useAuthContext';
import UserMenuPopover from './UserMenuPopover';

const useStyles = makeStyles((theme: Theme) => ({
  leftGridIcon: {
    fontSize: '32px',
    marginTop: theme.spacing(1),
  },
  rightGridIcon: {
    fontSize: '32px',
  },
}));

export interface Notification {
  index: number;
  title: string;
  content: string;
  dateform: string;
  readState: number;
}
interface HeaderLinksProps {
  routes: MypageRouteType[];
}

function HeaderLinks(props: HeaderLinksProps): JSX.Element {
  const { routes } = props;
  const notificationRef = useRef<HTMLButtonElement | null>(null);
  const classes = useStyles();
  const auth = useAuthContext();
  const {
    anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();
  const [UserMenuAnchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(UserMenuAnchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const UserMenuOpen = Boolean(UserMenuAnchorEl);

  // 개인 알림 - GET Request
  const [{ data: getData, loading: getLoading, error: getError }, executeGet] = useAxios({
    url: '/notification',
  }, { manual: true });

  // 자식 컴포넌트에서 안읽은 알림을 클릭했는지를 검사하기 위한 state
  const [changeReadState, setChangeReadState] = React.useState<boolean>(false);

  React.useEffect(() => {
    executeGet({
      params: {
        userId: auth.user.userId,
      },
    });
    if (changeReadState) {
      executeGet({
        params: {
          userId: auth.user.userId,
        },
      });
      setChangeReadState(false);
    }
  }, [changeReadState, executeGet, auth.user.userId]);

  return (
    <Grid container alignItems="flex-end" justify="flex-end">
      <Typography variant="h6" style={{ alignSelf: 'center' }}>
        {`${auth.user.userName} 님`}
      </Typography>
      <IconButton onClick={handleClick}>

        <Avatar style={{ height: '32px', width: '32px' }} />
      </IconButton>

      <Tooltip title="알림">
        <IconButton
          style={{ color: 'white' }}
          aria-label="notifications"
          ref={notificationRef}
          onClick={(e): void => {
            if (anchorEl) {
              handleAnchorClose();
            } else {
              handleAnchorOpen(e);
            }
          }}
        >
          <Badge
            badgeContent={!getLoading && getData && !getError
              ? (getData.filter((noti: Notification) => noti.readState === 0).length)
              : (null)}
            color="secondary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Notifications className={classes.rightGridIcon} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Hidden smDown>
        <Tooltip title="홈으로 이동">
          <IconButton
            style={{ color: 'white' }}
            aria-label="to-home"
            to={routes[0].layout + routes[0].path}
            component={Link}
          >
            <Home className={classes.rightGridIcon} />
          </IconButton>
        </Tooltip>
      </Hidden>

      {anchorEl && !getLoading && getData && !getError && (
      <NotificationPopper
        anchorEl={anchorEl}
        notificationData={getData}
        setChangeReadState={setChangeReadState}
      />
      )}
      <UserMenuPopover
        disableScrollLock
        open={UserMenuOpen}
        anchorEl={UserMenuAnchorEl}
        onClose={handleClose}
      />
    </Grid>
  );
}

export default HeaderLinks;
