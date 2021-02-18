import { List, Typography } from '@material-ui/core';
import React from 'react';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ColumnHeader from './ColumnHeader';
import PostItem from './PostItem';

interface PostListProps {
  boardColumns: Record<string, any>[],
  posts: any[],
  loading?: boolean
}
function PostList(props: PostListProps): JSX.Element {
  const {
    boardColumns, posts, loading,
  } = props;
  return (
    <List component="div" className="postListContainer">
      <ColumnHeader columns={boardColumns} />
      <List
        component="div"
        className="listItemContainer"
        style={{ minHeight: '300px' }}
      >
        {posts.map((post, index) => (
          <PostItem
            key={post.postId}
            post={post}
          />
        ))}
        {posts.length === 0 ? <Typography>데이터가 없습니다</Typography> : null}
        {loading ? <CenterLoading /> : null}

      </List>
    </List>
  );
}

export default PostList;
