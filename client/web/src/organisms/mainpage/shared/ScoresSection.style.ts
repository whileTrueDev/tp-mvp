import { makeStyles, Theme } from '@material-ui/core/styles';

export const useScoreSectionStyles = makeStyles((theme: Theme) => ({
  scoreItemContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  scoreLabelContainer: {
    width: '35%',
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    paddingLeft: '5%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    boxShadow: '-3px -2px 4px 0 rgba(0, 0, 0, 0.07)',
    '&>:nth-child(1)': {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(6),
    },
    [theme.breakpoints.down('xs')]: {
      height: theme.spacing(4),
    },
  },
  scoreLabelText: {
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1),
    },
  },
  scoreBarContainer: {
    flex: 1,
  },
}
));
