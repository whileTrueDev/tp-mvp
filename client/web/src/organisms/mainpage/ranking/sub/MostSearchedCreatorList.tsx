import useAxios from 'axios-hooks';
import React from 'react';
import { Creator, CreatorListRes } from '@truepoint/shared/dist/res/CreatorList.interface';
import {
  Avatar, List, ListItem, Typography,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import TitleWithLogo from '../../../mypage/userInfo/TitleWithLogo';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { useMyRatingsCreatorBoxStyles } from '../../../mypage/userInfo/styles/MyRatings.style';
import { useSearchTableStyle } from '../style/CreatorSearch.style';

export default function MostSearchedCreatorList(): JSX.Element {
  const { box } = useMyRatingsCreatorBoxStyles();
  const { creatorName } = useSearchTableStyle();
  const history = useHistory();
  const [{ data, loading, error }] = useAxios<CreatorListRes>({
    url: 'users/creator-list',
    method: 'get',
    params: {
      take: 20,
      sort: 'searchCount',
    },
  });

  const handleClick = (creator: Creator) => () => {
    const { creatorId } = creator;
    history.push(`/ranking/creator/${creatorId}`);
  };

  const renderList = (creatorList: Creator[]) => {
    if (!creatorList.length) return null;
    return creatorList.map((creator, i) => (
      <ListItem button key={creator.nickname} onClick={handleClick(creator)} style={{ justifyContent: 'space-around' }}>
        <Typography component="span" color={i >= 10 ? 'textSecondary' : 'textPrimary'} style={{ width: 30 }}>{i + 1}</Typography>
        <div style={{ width: 60, display: 'flex' }}>
          <Avatar style={{ width: 20, height: 20, marginRight: 4 }} src={`/images/logo/${creator.platform}Logo.png`} />
          <Avatar style={{ width: 20, height: 20 }} src={creator.logo} />
        </div>

        <Typography component="span" style={{ width: 90 }} className={creatorName}>{creator.nickname}</Typography>
        <Typography component="span" variant="caption" color="textSecondary" align="right" style={{ width: 90 }}>{creator.searchCount}</Typography>
      </ListItem>
    ));
  };

  return (
    <div>
      <TitleWithLogo text="많이 검색된 방송인 &gt;" />
      <List component="ol" className={box} style={{ padding: 0 }}>
        {loading && <ListItem><CenterLoading /></ListItem>}
        {!loading && data && renderList(data.data)}
        {!loading && error && <ListItem>오류가 발생하였습니다</ListItem>}
      </List>
    </div>
  );
}
