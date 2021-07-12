import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';
import { Creator, CreatorListRes } from '@truepoint/shared/dist/res/CreatorList.interface';
import {
  Avatar, List, ListItem, Typography,
} from '@material-ui/core';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
import TitleWithLogo from '../../../mypage/userInfo/TitleWithLogo';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { useMyRatingsCreatorBoxStyles } from '../../../mypage/userInfo/styles/MyRatings.style';
import { useMostSearchedCreatorListStyle, useSearchTableStyle } from '../style/CreatorSearch.style';

export default function MostSearchedCreatorList(): JSX.Element {
  const { box } = useMyRatingsCreatorBoxStyles();
  const { creatorName } = useSearchTableStyle();
  const classes = useMostSearchedCreatorListStyle();
  const history = useHistory();
  const [{ data, loading, error }, refetch] = useAxios<CreatorListRes>({
    url: 'users/creator-list',
    method: 'get',
    params: {
      take: 20,
      sort: 'searchCount',
    },
  });

  useEffect(() => {
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (creator: Creator) => () => {
    const { creatorId } = creator;
    history.push(`/ranking/creator/${creatorId}`);
  };

  const renderList = (creatorList: Creator[]) => {
    if (!creatorList.length) return null;
    return creatorList.map((creator, i) => {
      if (creator.searchCount > 0) {
        return (
          <ListItem component="li" button key={creator.nickname} onClick={handleClick(creator)} className={classes.listItem}>
            <Typography component="span" color={i >= 10 ? 'textSecondary' : 'textPrimary'} className="order">{i + 1}</Typography>
            <div className="logos">
              <Avatar className={classnames('logo', 'platform')} src={`/images/logo/${creator.platform}Logo.png`} />
              <Avatar className="logo" src={creator.logo} />
            </div>
            <Typography component="span" className={classnames(creatorName, 'nickname')}>{creator.nickname}</Typography>
            <Typography component="span" variant="caption" align="right" className="searchCount">{`${creator.searchCount}회 검색`}</Typography>
          </ListItem>
        );
      }
      return (
        <ListItem component="li" key={creator.nickname} className={classes.listItem}>
          <Typography component="span" color={i >= 10 ? 'textSecondary' : 'textPrimary'} className="order">{i + 1}</Typography>
          <div className="logos">
            <Avatar className="logo" />
          </div>
          <Typography component="span" className={classnames(creatorName, 'nickname')}>-</Typography>
          <Typography component="span" variant="caption" align="right" className="searchCount">-</Typography>
        </ListItem>
      );
    });
  };

  return (
    <div>
      <TitleWithLogo text="많이 검색된 방송인 &gt;" />
      <List component="ol" className={classnames(box)} style={{ padding: 0 }} dense>
        {loading && <ListItem><CenterLoading /></ListItem>}
        {!loading && data && renderList(data.data)}
        {!loading && error && <ListItem>오류가 발생하였습니다</ListItem>}
      </List>
    </div>
  );
}
