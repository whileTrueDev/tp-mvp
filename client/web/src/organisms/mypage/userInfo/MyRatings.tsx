import {
  Avatar, Badge, Typography, Link, Button,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import TitleWithLogo from './TitleWithLogo';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import { useMyRatingsCreatorBoxStyles } from './styles/MyRatings.style';
import { useMyRatings } from '../../../utils/hooks/query/useMyRatingsQuery';

// avatar + 플랫폼 배지 컴포넌트
export function AvatarWithPlatformBadge({
  platform,
  logo,
  name,
  avatarSize = 120,
  badgeSize = 32,
}: {
  platform: 'afreeca' | 'twitch',
  logo: string | undefined,
  name: string,
  avatarSize?: number,
  badgeSize?: number
}): JSX.Element {
  const platformBadge = {
    afreeca: <img src="/images/logo/afreecaLogo.png" alt="아프리카 로고" width={badgeSize} height={badgeSize} />,
    twitch: <img src="/images/logo/twitchLogo.png" alt="아프리카 로고" width={badgeSize} height={badgeSize} />,
  };
  return (
    <Badge
      overlap="circle"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      badgeContent={platformBadge[platform]}
    >
      <Avatar style={{ width: avatarSize, height: avatarSize }} alt={name} src={logo} />
    </Badge>
  );
}

export interface CreatorAvatarProps{
  rating: number;
  platform: 'twitch' | 'afreeca';
  creatorId: string;
  creatorDisplayName: string;
  creatorProfileImage: string | undefined;
}
// avatar + 크리에이터 명 + 별점 컴포넌트
export function CreatorAvatarWithRating(props: CreatorAvatarProps): JSX.Element {
  const { linkAvatar, mobileLinkAvatar } = useMyRatingsCreatorBoxStyles();
  const {
    rating, platform, creatorId, creatorDisplayName: name, creatorProfileImage: logo,
  } = props;
  const { isMobile } = useMediaSize();
  const path = `/ranking/creator/${creatorId}`;

  if (isMobile) {
    return (
      <Link className={mobileLinkAvatar} component={RouterLink} to={path}>

        <AvatarWithPlatformBadge
          platform={platform}
          name={name}
          logo={logo}
          avatarSize={50}
          badgeSize={16}
        />
        <Typography align="center">{name}</Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <Rating size="small" defaultValue={rating / 2} precision={0.5} readOnly />
          <Typography variant="caption">{`${rating}점`}</Typography>
        </div>

      </Link>
    );
  }

  return (
    <Link className={linkAvatar} component={RouterLink} to={path}>
      <AvatarWithPlatformBadge platform={platform} name={name} logo={logo} />
      <Typography align="center">{name}</Typography>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <Rating size="small" defaultValue={rating / 2} precision={0.5} readOnly />
        <Typography variant="caption">{`${rating}점`}</Typography>
      </div>

    </Link>
  );
}

export interface CreatorsBoxProps {
  loading: boolean,
  creators: CreatorAvatarProps[] | undefined,
  prevButtonHandler: () => void,
  nextButtonHandler: () => void,
  prevButtonDisabled: boolean,
  nextButtonDisabled: boolean
}
// CreatorAvatarWithRating을 렌더링하는 박스 컴포넌트
export function CreatorsBox(props: CreatorsBoxProps): JSX.Element {
  const {
    loading, creators, prevButtonHandler,
    nextButtonHandler,
    prevButtonDisabled,
    nextButtonDisabled,
  } = props;
  const classes = useMyRatingsCreatorBoxStyles();
  return (
    <div className={classes.box}>
      {loading && <CenterLoading />}
      {/* 평점 매긴 방송인이 있을 경우 목록 렌더링 */}
      {creators && creators.map((d: any) => (<CreatorAvatarWithRating key={d.creatorId} {...d} />))}
      {/* 평점 매긴 방송인이 없는 경우 */}
      {!loading && creators && !creators.length && (
        <Typography style={{ padding: '40px' }}>평점을 매긴 방송인이 없습니다</Typography>
      )}
      <Button className={classnames(classes.button, 'prev')} onClick={prevButtonHandler} disabled={prevButtonDisabled}>
        <img src="/images/rankingPage/backArrowImage.png" alt="이전버튼" />
      </Button>
      <Button className={classnames(classes.button, 'next')} onClick={nextButtonHandler} disabled={nextButtonDisabled}>
        <img src="/images/rankingPage/backArrowImage.png" alt="다음버튼" />
      </Button>

    </div>
  );
}

// 마이페이지(내 프로필 페이지)에서 내 평점보기 컴포넌트
export default function MyRatings(): JSX.Element {
  const auth = useAuthContext();
  const { isMobile } = useMediaSize();
  const [page, setPage] = useState<number>(1);
  const [itemPerPage, setItemPerPage] = useState<number>(isMobile ? 5 : 12);

  const { data, isFetching: loading, error } = useMyRatings({
    userId: auth.user.userId,
    page,
    itemPerPage,
  });

  const moveToPrevPage = () => {
    if (page <= 1) return;
    setPage((prevPage) => prevPage - 1);
  };
  const moveToNextPage = () => {
    if (!data || !(data?.hasMore)) return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setItemPerPage(isMobile ? 5 : 12);
    setPage(1);
  }, [isMobile]);

  if (error) {
    return <p>내평점보기 에러</p>;
  }
  return (
    <div>
      <TitleWithLogo text="내 평점 보기" />

      <CreatorsBox
        loading={loading}
        creators={data?.creators}
        prevButtonHandler={moveToPrevPage}
        nextButtonHandler={moveToNextPage}
        prevButtonDisabled={page <= 1 || loading}
        nextButtonDisabled={!(data?.hasMore) || loading}
      />
    </div>
  );
}
