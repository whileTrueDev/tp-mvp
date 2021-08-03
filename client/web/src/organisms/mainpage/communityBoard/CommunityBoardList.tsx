import {
  Grid, Tab, Tabs,
} from '@material-ui/core';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import BoardContainer from './list/BoardContainer';
import SmileIcon from '../../../atoms/svgIcons/SmileIcon';
import BoardTitle from './share/BoardTitle';
import HotPostBox from './list/HotPostBox';
import BoardHeaderImage from './list/BoardHeaderImage';
import useMediaSize from '../../../utils/hooks/useMediaSize';
import {
  useStyles, useTabItem, useTabPanel, useTabs,
} from './style/CommunityBoardList.style';
import { useHotPostsByPlatform } from '../../../utils/hooks/query/useCommunityPosts';
import { useCommunityBoardState } from '../../../store/useCommunityBoardState';

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
  // const { platform: currentPlatform, changePlatform } = useBoardContext();
  // 탭 인덱스
  // 0번째 탭 : 자유게시판
  // 1번째 탭 : 아프리카 게시판
  // 2번째 탭 : 트위치 게시판
  const {
    changePlatform,
    tabValue,
    changeAfreecaToRecommended,
    changeTwitchToRecommended,
  } = useCommunityBoardState();

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

  const handleTabChange = (_: any, newValue: number) => {
    changePlatform(newValue);
  };

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

  const boardTabs = [
    { key: 'free', label: '자유게시판', icon: icons.free },
    { key: 'afreeca', label: '아프리카 게시판', icon: icons.afreeca },
    { key: 'twitch', label: '트위치 게시판', icon: icons.twitch },
  ];

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
    />
  ), [freeTitleComponent, take]);
  const AfreecaBoard = useMemo(() => (
    <BoardContainer
      titleComponent={afreecaTitleComponent}
      platform="afreeca"
      take={take}
    />
  ), [afreecaTitleComponent, take]);

  const TwitchBoard = useMemo(() => (
    <BoardContainer
      platform="twitch"
      titleComponent={twitchTitleComponent}
      take={take}
    />
  ), [take, twitchTitleComponent]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const moveToAfreecaHotPostList = async () => {
    await changeAfreecaToRecommended();
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  };

  const moveToTwitchHotPostList = async () => {
    await changeTwitchToRecommended();
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
              value={tabValue}
              onChange={handleTabChange}
            >
              {
                boardTabs.map((tab) => (
                  <Tab
                    key={tab.key}
                    classes={tabItemClasses}
                    label={tab.label}
                    icon={tab.icon}
                  />
                ))
              }
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {FreeBoard}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {AfreecaBoard}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {TwitchBoard}
            </TabPanel>
          </div>
        </div>
      </section>

    </div>

  );
}
