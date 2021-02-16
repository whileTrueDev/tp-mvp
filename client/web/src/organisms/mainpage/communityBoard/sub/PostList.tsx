import { List, Typography } from '@material-ui/core';
import React from 'react';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import ColumnHeader from './ColumnHeader';
import PostItem from './PostItem';


interface PostListProps {
  boardColumns: Record<string,any>[],
  posts: any[],
  total: number,
  page: number,
  take: number,
  loading?: boolean
}
function PostList(props: PostListProps):JSX.Element{
  const {boardColumns,posts,total,page,take,loading} = props;
  return (
    <List component="div" className="postListContainer">
    <ColumnHeader columns={boardColumns} />
    <List component="div" className="listItemContainer"
      style={{minHeight: '300px'}}
    >
      {posts.map((post, index) => {
        const numbering = total - ((page - 1) * take) - index;
        return (
          <PostItem
            key={post.postId}
            post={post}
            numbering={numbering}
          />
        );
      })}
      {posts.length === 0 ? <Typography>데이터가 없습니다</Typography>: null}
      {loading ? <CenterLoading/>:null}
      
    </List>
  </List>
  );
}

export default PostList;