import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Popper, Box,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  popper: {
    marginTop: theme.spacing(2),
    zIndex: 800, // 마이페이지 내부 컴포넌트 < popper < 마이페이지 상단 네비바 && 최상단 네비바
  },
  box: {
    width: '911px',
    height: '700px',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    display: 'flex',
    flex: 1,
  },
  boxTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontWeight: 'bold',
    fontSize: '23px',
    color: theme.palette.text.secondary,
  },
}));

export interface PeriodSelectPopperProps {
  anchorEl: HTMLElement;
}

export default function PeriodSelectPopper(props: PeriodSelectPopperProps): JSX.Element {
  const { anchorEl } = props;
  const classes = useStyles();

  return (
    <Popper
      className={classes.popper}
      placement="bottom-start"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disablePortal
      modifiers={{
        flip: { enabled: false },
        preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
        hide: { enabled: false },
      }}
    >
      <Box
        boxShadow={1}
        borderRadius={16}
        borderColor="#707070"
        border={1}
        className={classes.box}
      >
        <Typography className={classes.boxTitle}>
          제외할 방송 선택
        </Typography>

      </Box>
    </Popper>
  );
}
