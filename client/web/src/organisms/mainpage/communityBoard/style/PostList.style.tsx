import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const rowHeightBase = 6; // row(listItem)하나당 높이 기준픽셀

export const useStyles = makeStyles((theme: Theme) => createStyles({
  postList: {
  },
  header: {
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    '& $cellText': {
      color: theme.palette.common.white,
    },
  },
  row: {
    display: 'flex',
    height: theme.spacing(rowHeightBase),
  },
  cell: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  cellText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.text.primary,
    fontSize: theme.typography.body1.fontSize,
    fontFamily: 'Noto Sans KR',
  },
  headerCell: {
    '&$cellText': {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  listContainer: {
    position: 'relative',
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? '100' : 'A400'],
  },
  listItem: { // button 엘리먼트 사용하고 있어서 기본 기본스타일 제거
    width: '100%',
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    cursor: 'pointer',
    border: 'none',
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    padding: 0,
    '&:hover': {
      backgroundColor: theme.palette.type === 'light' ? theme.palette.action.hover : theme.palette.grey[700],
    },
  },
  replies: {

  },
  currentPostItem: {
    backgroundColor: theme.palette.secondary.light,
    '&:before': {
      position: 'absolute',
      content: '""',
      top: theme.spacing(rowHeightBase / 2),
      left: theme.spacing(1),
      transform: 'translate(0,-50%)',
      borderTop: `${theme.spacing(1)}px solid transparent`,
      borderBottom: `${theme.spacing(1)}px solid transparent`,
      borderLeft: `${theme.spacing(1.2)}px solid ${theme.palette.primary.dark}`,
    },
  },
  mobile: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileTitle: {
    fontSize: theme.spacing(1.5),
  },
  mobileText: {
    fontSize: theme.spacing(1.5),
    marginRight: theme.spacing(2),
  },
  mobileNickname: {
    flex: 1,
    textAlign: 'right',
  },
  listEmpty: {
    paddingTop: theme.spacing(3),
  },
}));
