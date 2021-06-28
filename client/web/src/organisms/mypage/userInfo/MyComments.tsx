import { Typography } from '@material-ui/core';
import useAxios from 'axios-hooks';
import { MyCommentsRes } from '@truepoint/shared/dist/res/UserPropertiesResType.interface';
import React, { useEffect } from 'react';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { usePage } from '../../../utils/hooks/usePage';
import { MyPostPagination, MyPostItem } from './MyPosts';
import { useMyRatingsCreatorBoxStyles } from './styles/MyRatings.style';
import TitleWithLogo from './TitleWithLogo';

export default function MyComments(): JSX.Element {
  const { box } = useMyRatingsCreatorBoxStyles();
  const auth = useAuthContext();
  const {
    page, itemPerPage, handlePageChange,
  } = usePage({ defaultItemPerPage: 10 });

  const [{ data, loading, error }, getMyPosts] = useAxios<MyCommentsRes>({
    url: 'users/properties/comments',
    method: 'get',
    params: {
      userId: auth.user.userId,
      page,
      itemPerPage,
    },
  }, { manual: true });

  useEffect(() => {
    if (auth.user.userId) {
      getMyPosts({
        params: {
          userId: auth.user.userId,
          page,
          itemPerPage,
        },
      });
    }
  }, [auth.user.userId, getMyPosts, itemPerPage, page]);

  return (
    <div>
      <TitleWithLogo text="내가 쓴 댓글 보기" />
      <div className={box}>
        {loading && <CenterLoading />}
        <div style={{ width: '100%' }}>
          {!loading && !error && data?.comments.length === 0 && (
          <Typography>작성한 댓글이 없습니다</Typography>
          )}
          {data && data.comments.map((d) => (
            <MyPostItem
              key={`${d.commentId}_${d.to}`}
              content={d.content}
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
