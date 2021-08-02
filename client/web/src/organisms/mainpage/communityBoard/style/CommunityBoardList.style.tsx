import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import { BOARD_PAGE_MAX_WIDTH } from '../../../../assets/constants';

// 자유게시판 목록 스타일
export const useStyles = makeStyles((theme: Theme) => createStyles({
  communitySection: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  communityContainer: {
    width: '100%',
    maxWidth: BOARD_PAGE_MAX_WIDTH,
  },
  boardListSection: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.background.default,
  },
  smallLogo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(2),
      height: theme.spacing(2),
      marginRight: 0,
    },
  },
  hotPostSection: {
    '&>.MuiGrid-item': {
      maxWidth: '48%',
    },
    justifyContent: 'space-between',
    margin: theme.spacing(2, 0),
  },
  tabsSection: {
  },
}));

export const useTabs = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 'auto',
  },
  flexContainer: {
    justifyContent: 'flex-end',
  },
  indicator: {
    display: 'none',
  },
}));

export const useTabItem = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 'auto',
    borderTopRightRadius: theme.spacing(1),
    borderTopLeftRadius: theme.spacing(1),
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 1),
    },
  },
  wrapper: {
    flexDirection: 'row',
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body2.fontSize,
    },
    '& svg, & img': {
      display: 'none',
    },
  },
  selected: {
    '&$root': {
      backgroundColor: theme.palette.background.paper,
    },
    '& $wrapper': {
      color: theme.palette.text.primary,
      '& svg, & img': {
        display: 'block',
      },
    },
  },
}));

export const useTabPanel = makeStyles((theme: Theme) => createStyles({
  tabPanel: {
    backgroundColor: theme.palette.background.paper,
  },
}));

// 게시판 컨테이너 컴포넌트 스타일
export const useBoardContainerStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    height: '100%',
    width: '100%',
    minWidth: '650px',
    padding: theme.spacing(4, 8),
    '.postView &': {
      padding: 0,
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
      padding: theme.spacing(1),
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? '100' : 'A400'],
    marginBottom: theme.spacing(2),
    marginTop: 0,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.5),
    '&>.right': {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginLeft: theme.spacing(1),
      },
    },
  },
  writeButton: {
    width: theme.spacing(12),
    height: theme.spacing(4),
    padding: 0,
    '& .writeButtonText': {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      fontFamily: 'AppleSDGothicNeoR',
    },
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(6.5),
      height: theme.spacing(3.5),
      '& .writeButtonText': {
        fontSize: theme.typography.caption.fontSize,
      },
    },
  },
  searchForm: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const StyledToggleButton = withStyles((theme: Theme) => createStyles({
  root: {
    height: theme.spacing(3.5),
    minWidth: theme.spacing(10),
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(8),
    },
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      position: 'relative',
      '&:before': {
        display: 'block',
        position: 'absolute',
        content: '" "',
        borderRadius: '100%',
        width: theme.spacing(1),
        height: theme.spacing(1),
        backgroundColor: 'red',
        left: theme.spacing(0.5),
        top: '50%',
        transform: 'translateY(-50%)',
      },
      border: 'none',
    },
    '&.all': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
    },
    '&.notice': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.action.disabled,
    },
    '&.recommended': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  },
}))(ToggleButton);

export const useToggleButtonGroupsStyle = makeStyles((theme: Theme) => createStyles({
  root: {},
  groupedHorizontal: {
    '&:not(:last-child), &:not(:first-child), &': {
      borderRadius: theme.spacing(0.5),
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}));
