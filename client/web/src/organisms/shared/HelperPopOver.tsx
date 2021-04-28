import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
  icon: { color: theme.palette.primary.dark },
  popover: { pointerEvents: 'none' },
  paper: { padding: theme.spacing(1) },
  popoverContents: { width: 400, textAlign: 'center', padding: theme.spacing(1) },
}));

export default function HelperPopOver(): JSX.Element {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        component="span"
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <HelpIcon className={classes.icon} />
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        disableScrollLock
      >
        <div className={classes.popoverContents}>

          <Typography>
            차트에서 표시되는 방송의 편집점 구간을 편집점 툴의 타임라인에서 바로 확인할 수 있도록 파일로 내보낼 수 있습니다.
          </Typography>
          <br />
          <Typography>
            내보내고 싶은 확장자로 선택 후 버튼을 눌러주세요. 보다 상세한 사항은
            {' '}
            <strong>편집점 파일 활용법 버튼</strong>
            을 클릭해주세요!
          </Typography>
        </div>
      </Popover>
    </div>
  );
}
