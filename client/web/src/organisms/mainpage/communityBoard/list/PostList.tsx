import { List, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ColumnHeader from './ColumnHeader';
import PostItem from './PostItem';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {

  },
  rowItem: {
    minHeight: '300px', padding: 'none',
  },

}));

interface PostListProps {
  boardColumns: Record<string, any>[],
  posts: any[],
  loading?: boolean,
}
function PostList(props: PostListProps): JSX.Element {
  const {
    boardColumns, posts, loading,
  } = props;
  const classes = useStyles();
  const widths = boardColumns.map((col) => col.width);

  return (
    <List component="div" className={classes.root}>
      <ColumnHeader columns={boardColumns} />
      <Paper>
        <List
          component="div"
          className={classes.rowItem}
        >

          {posts.map((post) => (
            <PostItem
              key={post.postId}
              post={post}
              widths={widths}
            />
          ))}
          {posts.length === 0 ? <Typography>데이터가 없습니다</Typography> : null}
          {loading ? <CenterLoading /> : null}

        </List>

      </Paper>
    </List>
  );
}

export default PostList;
