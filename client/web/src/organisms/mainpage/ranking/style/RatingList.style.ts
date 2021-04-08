import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
// listItem 컴포넌트
export const useRatingsListItemStyles = makeStyles((theme: Theme) => createStyles({
  listItem: {
    height: theme.spacing(12),
    border: '2px solid black',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  avatarImage: {
    marginRight: theme.spacing(2),
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  creatorName: {
    marginRight: theme.spacing(1),
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: theme.typography.body1.fontSize,
  },
  orderText: {
    padding: theme.spacing(0, 1),
    backgroundColor: 'blue',
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightBold,
  },
  [`listItem-${1}`]: {
    backgroundColor: lighten(theme.palette.primary.main, 0.25),
  },
  [`listItem-${2}`]: {
    backgroundColor: lighten(theme.palette.primary.main, 0.5),
  },
  [`listItem-${3}`]: {
    backgroundColor: lighten(theme.palette.primary.main, 0.75),
  },
  [`listItem-${4}`]: {
    backgroundColor: lighten(theme.palette.primary.main, 0.9),
  },
}));

// list 컴포넌트
export const useRatingsListStyles = makeStyles((theme: Theme) => createStyles({
  ratingsListSection: {
    border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(1, 0, 0, 1),
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  listItemContainer: {
  },
  text: {
    padding: theme.spacing(2),
  },

}));
