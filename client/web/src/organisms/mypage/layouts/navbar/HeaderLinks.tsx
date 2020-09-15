import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import Home from '@material-ui/icons/Home';
// axios-hooks
import useAxios from 'axios-hooks';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
// notificaiton list component
import NotificationPopper from './NotificationPopper';
// style
import useNavbarStyles from './Navbar.style';
// type
import { MypageRoute as MypageRouteType } from '../../../../pages/mypage/routes';

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
  const classes = useNavbarStyles();
  const {
    anchorEl, handleAnchorOpen, handleAnchorOpenWithRef, handleAnchorClose
  } = useAnchorEl();

  // 개인 알림 - GET Request
  // userId 쿠키 or 헤더 토큰에서 추출
  const [{ data: getData, loading: getLoading, error: getError }, excuteGet] = useAxios({
    url: 'http://localhost:3000/notification',
    params: {
      userId: 'testtest',
    }
  });

  // 자식 컴포넌트에서 안읽은 알림을 클릭했는지를 검사하기 위한 state
  const [changeReadState, setChangeReadState] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (changeReadState) {
      excuteGet();
      setChangeReadState(false);
    }
  }, [changeReadState, excuteGet]);

  return (
    <Grid container alignItems="flex-end" justify="flex-end">
      <Hidden smDown>
        <Tooltip title="홈으로 이동">
          <IconButton
            aria-label="to-home"
            to={routes[0].layout + routes[0].path}
            component={Link}
          >
            <Home className={classes.rightGridIcon} />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Tooltip title="알림">
        <IconButton
          style={{ marginRight: '27px' }}
          aria-label="notifications"
          ref={notificationRef}
          onClick={(e): void => {
            if (anchorEl) { handleAnchorClose(); } else { handleAnchorOpen(e); }
          }}
        >
          <Badge
            badgeContent={!getLoading && getData && !getError
              ? (getData.filter((noti: Notification) => noti.readState === 0).length)
              : (null)}
            color="secondary"
          />
          <Notifications className={classes.rightGridIcon} />
        </IconButton>
      </Tooltip>

      {anchorEl && !getLoading && getData && !getError && (
      <NotificationPopper
        anchorEl={anchorEl}
        notificationData={getData}
        setChangeReadState={setChangeReadState}
      />
      )}
    </Grid>
  );
}

export default HeaderLinks;
