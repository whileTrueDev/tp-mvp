import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';
import Pagination, { PaginationProps } from '@material-ui/lab/Pagination';
import { Grid, Link, Typography } from '@material-ui/core';
import { MyPostsRes } from '@truepoint/shared/dist/res/UserPropertiesResType.interface';
import { Link as RouterLink } from 'react-router-dom';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import TitleWithLogo from './TitleWithLogo';
import { useMyRatingsCreatorBoxStyles } from './styles/MyRatings.style';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import { usePage } from '../../../utils/hooks/usePage';
import { useMyPostsItemStyle } from './styles/MyPosts.style';
import dateExpression from '../../../utils/dateExpression';

//* *내가 쓴 글 && 댓글 페이지네이션 컴포넌트********************* */
export function MyPostPagination(props: PaginationProps): JSX.Element {
  return (
    <Pagination
      shape="rounded"
      showFirstButton
      showLastButton
      defaultPage={1}
      {...props}
    />
  );
}
//* *내가 쓴 글 && 댓글 listItem 컴포넌트********************* */
export interface MyPostItemProps{
  content: string;
  createDate: Date;
  to: string;
  belongTo: string;
}
export function MyPostItem(props: MyPostItemProps): JSX.Element {
  const {
    content, createDate, to, belongTo,
  } = props;
  const classes = useMyPostsItemStyle();
  return (
    <Link component={RouterLink} to={to} className={classes.item}>
      <Grid container justify="space-between">
        <Typography className="content">{content}</Typography>
        <Typography className="date">
          {dateExpression({
            compoName: 'fromNow',
            createdAt: createDate,
          })}

        </Typography>
      </Grid>

      <Typography className="origin">{`게시판: ${belongTo}`}</Typography>
    </Link>
  );
}

//* *내가 쓴 글 && 댓글 컨테이너 컴포넌트********************* */
export default function MyPosts(): JSX.Element {
  const { box } = useMyRatingsCreatorBoxStyles();
  const auth = useAuthContext();
  const {
    page, itemPerPage, handlePageChange,
  } = usePage({ defaultItemPerPage: 10 });

  const [{ data, loading, error }, getMyPosts] = useAxios<MyPostsRes>({
    url: 'users/properties/posts',
    method: 'get',
    params: {
      userId: auth.user.userId,
      page,
      itemPerPage,
    },
  });

  useEffect(() => {
    getMyPosts({
      params: {
        userId: auth.user.userId,
        page,
        itemPerPage,
      },
    });
  }, [page]);

  return (
    <div>
      <TitleWithLogo text="내가 쓴 게시글 보기" />
      <div className={box}>
        {loading && <CenterLoading />}
        <div style={{ width: '100%' }}>
          {!loading && !error && data?.posts.length === 0 && (
          <Typography>작성한 게시글이 없습니다</Typography>
          )}
          {data && data.posts.map((d) => (
            <MyPostItem
              key={`${d.postId}_${d.to}`}
              content={d.title}
              createDate={d.createDate}
              belongTo={d.belongTo}
              to={d.to}
            />
          ))}

        </div>

        <MyPostPagination
          count={data?.totalPage || 1}
          page={page}
          onChange={handlePageChange}
        />
      </div>

    </div>
  );
}
