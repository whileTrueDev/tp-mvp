import { makeStyles, Theme, createStyles } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
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
    '& .MuiPagination-ul>*:first-child>.MuiPaginationItem-root': {
      border: '1px solid currentColor',
    },
    '& .MuiPagination-ul>*:last-child>.MuiPaginationItem-root': {
      border: '1px solid currentColor',
    },
  },
  paginationItem: {
    '&.MuiPaginationItem-root': {
      color: theme.palette.text.secondary,
      border: 'none',
      fontSize: theme.typography.body1.fontSize,
    },
    '&.Mui-selected': {
      color: theme.palette.text.primary,
    },
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
      minWidth: theme.spacing(9),
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
        left: theme.spacing(1),
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
