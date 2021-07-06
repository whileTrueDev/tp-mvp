import useAxios from 'axios-hooks';
import React from 'react';
import { Creator, CreatorListRes } from '@truepoint/shared/dist/res/CreatorList.interface';
import { List, ListItem } from '@material-ui/core';
import TitleWithLogo from '../../../mypage/userInfo/TitleWithLogo';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { useMyRatingsCreatorBoxStyles } from '../../../mypage/userInfo/styles/MyRatings.style';

export default function MostSearchedCreatorList(): JSX.Element {
  const { box } = useMyRatingsCreatorBoxStyles();
  const [{ data, loading, error }] = useAxios<CreatorListRes>({
    url: 'users/creator-list',
    method: 'get',
    params: {
      take: 20,
      sort: 'searchCount',
    },
  });

  const renderList = (creatorList: Creator[]) => {
    if (!creatorList.length) return null;
    return creatorList.map((creator, i) => (
      <ListItem key={creator.nickname}>
        <span>{i + 1}</span>
        <span>{creator.platform}</span>
        <span>{creator.nickname}</span>
        <span>{creator.searchCount}</span>
      </ListItem>
    ));
  };

  return (
    <div>
      <TitleWithLogo text="많이 검색된 방송인" />
      <List component="ol" className={box}>
        {loading && <ListItem><CenterLoading /></ListItem>}
        {!loading && data && renderList(data.data)}
        {!loading && error && <ListItem>오류가 발생하였습니다</ListItem>}
      </List>
    </div>
  );
}
