import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
import Person from '@material-ui/icons/Person';
import Home from '@material-ui/icons/Home';
import SpeakerNotes from '@material-ui/icons/SpeakerNotes';
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';

function HeaderLinks(): JSX.Element {
  const notificationRef = useRef<HTMLButtonElement | null>(null);
  const {
    anchorEl, handleAnchorOpen, handleAnchorOpenWithRef, handleAnchorClose
  } = useAnchorEl();

  return (
    <Grid alignItems="flex-end">
      <Hidden smDown>
        <Tooltip title="홈으로 이동">
          <IconButton
            aria-label="to-home"
            to="/"
            component={Link}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </Hidden>

      <Hidden smDown>
        <Tooltip title="알림">
          <IconButton
            aria-label="notifications"
            ref={notificationRef}
            onClick={(e): void => {
              if (anchorEl) { handleAnchorClose(); } else { handleAnchorOpen(e); }
            }}
          >
            {/* 
            <Badge
              badgeContent={!notificationGet.loading && notificationGet.data
                ? (notificationGet.data.notifications.filter((noti) => noti.readState === 0).length)
                : (null)}
              color="secondary"
            >
              
            </Badge>
            */}
            <Notifications />
          </IconButton>
        </Tooltip>
      </Hidden>

    </Grid>
  );
}

export default HeaderLinks;
