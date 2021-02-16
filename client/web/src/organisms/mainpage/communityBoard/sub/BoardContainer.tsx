// import { TablePagination } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import { ListItem, List, Typography } from '@material-ui/core';
import * as dateFns from 'date-fns';
import ko from 'date-fns/locale/ko';
import {
  makeStyles, createStyles, Theme, useTheme,
} from '@material-ui/core/styles';

const boardColumns = [
  { key: 'numbering', title: '글번호', width: '5%' },
  { key: 'title', title: '제목', width: '50%' },
  { key: 'writer', title: '작성자', width: '20%' },
  { key: 'date', title: '작성일', width: '15%' },
  { key: 'hit', title: '조회수', width: '5%' },
  { key: 'recommend', title: '추천수', width: '5%' },
];
function ColumnHeader({ columns }: {
 columns: Record<string, any>[]
}) {
  const theme = useTheme();
  return (
    <ListItem
      component="div"
      style={{
        display: 'flex',
        backgroundColor: theme.palette.primary.main,
      }}
    >
      {columns.map((col) => (
        <Typography
          style={{
            width: col.width,
            textAlign: 'center',
            color: theme.palette.primary.contrastText,
          }}
          key={col.key}
        >
          {col.title}
        </Typography>
      ))}
    </ListItem>
  );
}
const usePostItemStyles = makeStyles((theme: Theme) => createStyles({
  numbering: { width: '5%', textAlign: 'center' },
  title: {
    width: ' 50%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  writer: { width: '20%', textAlign: 'center' },
  date: { width: '15%', textAlign: 'center' },
  hit: { width: '5%', textAlign: 'center' },
  recommend: { width: '5%', textAlign: 'center' },
}));

interface PostItemProps{
  post: any;
  numbering: number;
}
function PostItem({
  post,
  numbering,
}: PostItemProps): JSX.Element {
  const classes = usePostItemStyles();
  const {
    postId, title, nickname, ip, createDate,
    platform, category, hit, recommend, replies,
  } = post;

  let dateDisplay: string;
  const date = new Date(createDate);
  if (date.getDate() === new Date().getDate()) {
    // 오늘 날짜인 경우
    dateDisplay = `${dateFns.formatDistanceToNow(date, { locale: ko })} 전`;
  } else {
    dateDisplay = dateFns.format(date, 'yyyy-MM-dd');
  }

  const ipDisplay = ip;
  const userDisplay = `${nickname}${category === 0 ? ipDisplay : ''}`; // category===0 일반글인 경우만 ip보이게
  const titleDisplay = `${title}${replies > 0 ? `[${replies}]` : ''}`;
  return (
    <ListItem
      button
      onClick={() => {
        // 개별글 보기로 이동
        console.log(post);
      }}
    >
      <Typography className={classes.numbering}>{numbering}</Typography>
      <Typography className={classes.title}>{titleDisplay}</Typography>
      <Typography className={classes.writer}>{userDisplay}</Typography>
      <Typography className={classes.date}>{dateDisplay}</Typography>
      <Typography className={classes.hit}>{hit}</Typography>
      <Typography className={classes.recommend}>{recommend}</Typography>
    </ListItem>
  );
}
const platform = 'afreeca';
const category = 'all';
const page = 1;
const take = 10; // rows per page
// localhost:3000/community/posts?platform=afreeca&category=all&page=1&take=20
export default function BoardContainer(): JSX.Element {
  const [total, setTotal] = useState<number>(0);
  const [, getPostList] = useAxios({ url: `/community/posts?platform=${platform}&category=${category}&page=${page}&take=${take}` }, { manual: true });
  const [posts, setPosts] = useState<any[]>([]);
  // const [currentPostId, setCurrentPostId] = useState<number>(-1);
  useEffect(() => {
    getPostList().then((res) => {
      const { posts: loadedPosts, total: loadedTotal } = res.data;
      console.log(loadedPosts);
      setTotal(loadedTotal);
      setPosts(loadedPosts);
    }).catch((e) => {
      console.error(e);
    });
  }, []);
  return (
    <div className="boardContainer">
      <div className="header">
        <div className="title">아프리카게시판</div>
        <div className="controls">
          <div className="filterButtonGroups">
            <button>전체글</button>
            <button>추천글</button>
            <button>공지</button>
          </div>
          <div>
            <select className="postPerPageSelectBox">
              {[10, 20].map((val) => (<option key={val}>{`${val}개`}</option>))}
            </select>
            <button>아프리카 글쓰기</button>
          </div>
        </div>
      </div>

      <List component="div" className="postListContainer">
        {/* <div className="columnHeader">
          {['번호', '제목', '글쓴이', '작성일', '조회', '추천'].map((col) => (<span key={col}>{col}</span>))}
        </div> */}
        <ColumnHeader columns={boardColumns} />
        <List component="div" className="listItemContainer">
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
        </List>
      </List>

      <Pagination count={Math.ceil(total / take)} size="small" />

      <div className="searchForm">
        <select>
          {['제목+내용', '글쓴이'].map((val) => (<option key={val}>{val}</option>))}
        </select>
        <input placeholder="검색할 내용을 입력하세요" />
        <button>검색</button>
      </div>
    </div>
  );
}
