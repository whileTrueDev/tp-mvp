import { createStyles, makeStyles } from '@material-ui/core';

export const useCreatorEvalutationCardStyle = makeStyles((theme) => createStyles({
  creatorEvaluationCardContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      padding: theme.spacing(0.5),
    },
  },
  arrowIcon: {
    fontSize: theme.typography.h2.fontSize,
  },
}));
