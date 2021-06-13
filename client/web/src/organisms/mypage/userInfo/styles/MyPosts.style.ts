import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

//* *내가 쓴 글 && 댓글 listItem 컴포넌트 스타일********************* */
export const useMyPostsItemStyle = makeStyles((theme: Theme) => createStyles({
  item: {
    color: theme.palette.text.primary,
    width: '100%',
    display: 'block',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .contenet': {
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      wordBreak: 'keep-all',
      maxWidth: '70%',
      whiteSpace: 'pre-wrap',
    },
    '& .date': {
      fontSize: theme.typography.caption.fontSize,
      color: theme.palette.text.secondary,
    },
    '& .origin': {
      fontSize: theme.typography.caption.fontSize,
    },
  },
}));

//* *내가 쓴 글 && 댓글 컨테이너 컴포넌트 스타일********************* */
export const useMyPostsStyle = makeStyles((theme: Theme) => createStyles({

}));
