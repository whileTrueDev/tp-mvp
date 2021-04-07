import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// listItem 컴포넌트
export const useRatingsListItemStyles = makeStyles((theme: Theme) => createStyles({
  listItem: {
    height: theme.spacing(14),
  },
  avatarImage: {
    marginRight: theme.spacing(2),
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  creatorName: {
    marginRight: theme.spacing(1),
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
  },
  ratingText: {
    fontSize: theme.typography.body1.fontSize,
  },
}));

// list 컴포넌트
export const useRatingsListStyles = makeStyles((theme: Theme) => createStyles({
  ratingsListSection: {
    border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    padding: theme.spacing(2),
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
  listItemContainer: {
    height: 10.2 * theme.spacing(14), // theme.spacing(14) : listItem 높이, 아이템10개 + 여유공간
  },
  text: {
    padding: theme.spacing(2),
  },
}));
