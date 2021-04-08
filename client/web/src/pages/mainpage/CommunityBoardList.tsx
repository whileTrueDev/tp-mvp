import {
  Container,
  Grid, Tab, Tabs,
} from '@material-ui/core';
import React, { useMemo, useRef, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import CommunityBoardCommonLayout from '../../organisms/mainpage/communityBoard/share/CommunityBoardCommonLayout';
import BoardContainer from '../../organisms/mainpage/communityBoard/list/BoardContainer';
import useBoardState from '../../utils/hooks/useBoardListState';
import BoardTitle from '../../organisms/mainpage/communityBoard/share/BoardTitle';

const useStyles = makeStyles((theme: Theme) => createStyles({
  centerWrapper: {
    width: '100%',
    minWidth: '1400px', // <ProductHero/>의 minWidth에 맞춤
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  boardWrapper: {
    width: '45%',
  },
  hide: {
    visibility: 'hidden',
  },
  boardListSection: {
    backgroundColor: theme.palette.primary.main,
  },
  maxWidthWrapper: {
    padding: theme.spacing(4, 6),
    minWidth: theme.breakpoints.values.md,
  },
  smallLogo: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

const useTabs = makeStyles({
  flexContainer: {
    justifyContent: 'flex-end',
  },
  indicator: {
    display: 'none',
  },
});

const useTabItem = makeStyles((theme: Theme) => createStyles({
  root: {
    minWidth: theme.spacing(30),
    minHeight: 'auto',
    borderTopRightRadius: theme.spacing(1),
    borderTopLeftRadius: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(20),
    },
  },
  wrapper: {
    flexDirection: 'row',
    color: theme.palette.background.paper,
    fontSize: theme.typography.h6.fontSize,
    '& svg, & img': {
      display: 'none',
    },
  },
  selected: {
    '&$root': {
      backgroundColor: theme.palette.background.paper,
    },
    '& $wrapper': {
      color: theme.palette.text.primary,
      '& svg, & img': {
        display: 'block',
      },
    },
  },
}));

const useTabPanel = makeStyles((theme: Theme) => createStyles({
  tabPanel: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(10),
  },
}));
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

export default function CommunityBoardList(): JSX.Element {
  const classes = useStyles();
  const tabsClasses = useTabs();
  const tabItemClasses = useTabItem();
  // 탭 인덱스
  // 0번째 탭 : 자유게시판
  // 1번째 탭 : 아프리카 게시판
  // 2번째 탭 : 트위치 게시판
  const [value, setValue] = React.useState<number>(0);
  const handleChange = (event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setValue(newValue);
  };

  const select = useRef<number[]>([10, 20]); // 한 페이지당 보여질 글 개수 select 옵션
  const [take] = useState<number>(select.current[0]); // 한 페이지당 보여질 글 개수

  const {
    boardState: freeBoard,
    pagenationHandler: freePagenationHandler,
    handlePostsLoad: freePostLoadHandler,
    changeFilter: changeFreeFilter,
  } = useBoardState({}); // 자유게시판 상태, 핸들러
  const {
    boardState: afreecaBoard,
    pagenationHandler: afreecaPagenationHandler,
    handlePostsLoad: afreecaPostLoadHandler,
    changeFilter: changeAfreecaFilter,
  } = useBoardState({}); // 아프리카 게시판 상태, 핸들러
  const {
    boardState: twitchBoard,
    pagenationHandler: twitchPagenationHandler,
    handlePostsLoad: twitchPostLoadHandler,
    changeFilter: changeTwitchFilter,
  } = useBoardState({});// 트위치 게시판 상태, 핸들러

  // memo 적용한 컴포넌트들, dependencies에 포함된 값이 바뀔때만 리렌더링 되도록 한다
  const freeTitleComponent = useMemo(() => (
    <BoardTitle platform="free" />
  ), []);

  const afreecaTitleComponent = useMemo(() => (
    <BoardTitle platform="afreeca" />
  ), []);
  const twitchTitleComponent = useMemo(() => (
    <BoardTitle platform="twitch" />
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

  return (
    <CommunityBoardCommonLayout>
      <div className={classes.boardListSection}>
        <Container maxWidth="xl" className={classes.maxWidthWrapper}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <div>
                아프리카 핫시청자 반응
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                트위치 핫시청자 반응
              </div>
            </Grid>
          </Grid>

          <div>
            <Tabs
              classes={tabsClasses}
              value={value}
              onChange={handleChange}
            >
              <Tab
                classes={tabItemClasses}
                label="자유게시판"
                icon={<SentimentSatisfiedAltIcon className={classes.smallLogo} />}
              />
              <Tab
                classes={tabItemClasses}
                label="아프리카 게시판"
                icon={<img className={classes.smallLogo} alt="아프리카 로고" src="images/logo/afreecaLogo.png" />}
              />
              <Tab
                classes={tabItemClasses}
                label="트위치 게시판"
                icon={<img className={classes.smallLogo} alt="트위치 로고" src="images/logo/twitchLogo.png" />}
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
        </Container>

      </div>
    </CommunityBoardCommonLayout>

  );
}
