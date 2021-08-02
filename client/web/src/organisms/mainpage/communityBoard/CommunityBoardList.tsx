import {
  Grid, Tab, Tabs,
} from '@material-ui/core';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import useAxios from 'axios-hooks';
import { FindPostResType } from '@truepoint/shared/dist/res/FindPostResType.interface';
import BoardContainer from './list/BoardContainer';
import useBoardState from '../../../utils/hooks/useBoardListState';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';
import BoardTitle from './share/BoardTitle';
import HotPostBox from './list/HotPostBox';
import useBoardContext from '../../../utils/hooks/useBoardContext';
import BoardHeaderImage from './list/BoardHeaderImage';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import {
  useStyles, useTabItem, useTabPanel, useTabs,
} from './style/CommunityBoardList.style';
import { useHotPostsByPlatform } from '../../../utils/hooks/query/useCommunityPosts';

interface TabPanelProps {
  children?: React.ReactNode | JSX.Element | JSX.Element[];
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const {
    children, value, index, ...other
  } = props;
  const classes = useTabPanel();

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          { children }
        </>
      )}
    </div>
  );
}

const titleContents = {
  free: {
    title: '자유 게시판',
    subTitle: '인터넷 방송과 관련하여 자유롭게 소통하는 곳입니다',
  },
  afreeca: {
    title: '아프리카 게시판',
    subTitle: '인터넷 방송과 관련하여 자유롭게 소통하는 곳입니다',
  },
  twitch: {
    title: '트위치 게시판',
    subTitle: '인터넷 방송과 관련하여 자유롭게 소통하는 곳입니다',
  },
};

export default function CommunityBoardList(): JSX.Element {
  const classes = useStyles();
  const tabsClasses = useTabs();
  const tabItemClasses = useTabItem();
  const { isMobile } = useMediaSize();
  const { platform: currentPlatform, changePlatform } = useBoardContext();

  // 아프리카 핫시청자 반응(추천글)
  const {
    data: afreecaHotPosts,
    isFetching: afreecaHotPostsLoading,
    error: afreecaHotPostsError,
  } = useHotPostsByPlatform({
    platform: 'afreeca',
  });
    // 트위치 핫시청자 반응(추천글)
  const {
    data: twitchHotPosts,
    isFetching: twitchHotPostsLoading,
    error: twitchHotPostsError,
  } = useHotPostsByPlatform({
    platform: 'twitch',
  });

  const select = useRef<number[]>([15]); // 한 페이지당 보여질 글 개수 select 옵션
  const [take] = useState<number>(select.current[0]); // 한 페이지당 보여질 글 개수

  const {
    boardState: freeBoard,
    pagenationHandler: freePagenationHandler,
    handlePostsLoad: freePostLoadHandler,
    filter: freeboardFilter,
    changeFilter: changeFreeFilter,
  } = useBoardState({}); // 자유게시판 상태, 핸들러
  const {
    boardState: afreecaBoard,
    pagenationHandler: afreecaPagenationHandler,
    handlePostsLoad: afreecaPostLoadHandler,
    filter: afreecaboardFilter,
    changeFilter: changeAfreecaFilter,
  } = useBoardState({}); // 아프리카 게시판 상태, 핸들러
  const {
    boardState: twitchBoard,
    pagenationHandler: twitchPagenationHandler,
    handlePostsLoad: twitchPostLoadHandler,
    filter: twitchboardFilter,
    changeFilter: changeTwitchFilter,
  } = useBoardState({});// 트위치 게시판 상태, 핸들러

  // 탭 인덱스
  // 0번째 탭 : 자유게시판
  // 1번째 탭 : 아프리카 게시판
  // 2번째 탭 : 트위치 게시판
  const [value, setValue] = React.useState<number>(0);
  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      changePlatform('free');
      if (freeboardFilter !== 'all') changeFreeFilter('all');
    } else if (newValue === 1) {
      changePlatform('afreeca');
      if (afreecaboardFilter !== 'all') changeAfreecaFilter('all');
    } else if (newValue === 2) {
      changePlatform('twitch');
      if (twitchboardFilter !== 'all') changeTwitchFilter('all');
    }
  };

  useEffect(() => {
    if (currentPlatform === 'free') {
      setValue(0);
    } else if (currentPlatform === 'afreeca') {
      setValue(1);
    } else if (currentPlatform === 'twitch') {
      setValue(2);
    }
  }, [currentPlatform]);

  useEffect(() => {
    if (window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  const icons = {
    free: <SmileIcon className={classes.smallLogo} />,
    afreeca: <img className={classes.smallLogo} alt="아프리카 로고" src="images/logo/afreecaLogo.png" />,
    twitch: <img className={classes.smallLogo} alt="트위치 로고" src="images/logo/twitchLogo.png" />,
  };

  // memo 적용한 컴포넌트들, dependencies에 포함된 값이 바뀔때만 리렌더링 되도록 한다
  const freeTitleComponent = useMemo(() => (
    <BoardTitle
      platform="free"
      imageSrc="images/rankingPage/smileIconImage.svg"
      title={titleContents.free.title}
      subTitle={titleContents.free.subTitle}
    />
  ), []);

  const afreecaTitleComponent = useMemo(() => (
    <BoardTitle
      platform="afreeca"
      imageSrc="images/logo/afreecaLogo.png"
      title={titleContents.afreeca.title}
      subTitle={titleContents.afreeca.subTitle}
    />
  ), []);
  const twitchTitleComponent = useMemo(() => (
    <BoardTitle
      platform="twitch"
      imageSrc="images/logo/twitchLogo.png"
      title={titleContents.twitch.title}
      subTitle={titleContents.twitch.subTitle}
    />
  ), []);

  const FreeBoard = useMemo(() => (
    <BoardContainer
      titleComponent={freeTitleComponent}
      platform="free"
      take={take}
      pagenationHandler={freePagenationHandler}
      boardState={freeBoard}
      postFilterHandler={changeFreeFilter}
      handlePostsLoad={freePostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, freeBoard]);
  const AfreecaBoard = useMemo(() => (
    <BoardContainer
      titleComponent={afreecaTitleComponent}
      platform="afreeca"
      take={take}
      pagenationHandler={afreecaPagenationHandler}
      boardState={afreecaBoard}
      postFilterHandler={changeAfreecaFilter}
      handlePostsLoad={afreecaPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, afreecaBoard]);

  const TwitchBoard = useMemo(() => (
    <BoardContainer
      platform="twitch"
      titleComponent={twitchTitleComponent}
      take={take}
      pagenationHandler={twitchPagenationHandler}
      boardState={twitchBoard}
      postFilterHandler={changeTwitchFilter}
      handlePostsLoad={twitchPostLoadHandler}
    />
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [take, twitchBoard]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const moveToAfreecaHotPostList = () => {
    setValue(1);
    changeAfreecaFilter('recommended');
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  const moveToTwitchHotPostList = () => {
    setValue(2);
    changeTwitchFilter('recommended');
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  return (
    <div className={classes.boardListSection}>
      <BoardHeaderImage />
      <section className={classes.communitySection}>
        <div className={classes.communityContainer}>

          {!isMobile && (
          <Grid container className={classes.hotPostSection}>
            <Grid item xs={6}>
              <HotPostBox
                platform="afreeca"
                posts={afreecaHotPosts ? afreecaHotPosts.posts : []}
                loading={afreecaHotPostsLoading}
                error={afreecaHotPostsError}
                buttonHandler={moveToAfreecaHotPostList}
              />
            </Grid>
            <Grid item xs={6}>
              <HotPostBox
                platform="twitch"
                posts={twitchHotPosts ? twitchHotPosts.posts : []}
                loading={twitchHotPostsLoading}
                error={twitchHotPostsError}
                buttonHandler={moveToTwitchHotPostList}
              />
            </Grid>
          </Grid>
          )}

          <div ref={scrollRef} className={classes.tabsSection}>
            <Tabs
              classes={tabsClasses}
              value={value}
              onChange={handleChange}
            >
              <Tab
                classes={tabItemClasses}
                label="자유게시판"
                icon={icons.free}
              />
              <Tab
                classes={tabItemClasses}
                label="아프리카 게시판"
                icon={icons.afreeca}
              />
              <Tab
                classes={tabItemClasses}
                label="트위치 게시판"
                icon={icons.twitch}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              {FreeBoard}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {AfreecaBoard}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {TwitchBoard}
            </TabPanel>
          </div>
        </div>
      </section>

    </div>

  );
}
