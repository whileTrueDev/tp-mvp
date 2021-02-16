import { Pagination, ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import useAxios from 'axios-hooks';
import PostList from './PostList';
import useBoardState, {FilterType} from '../useBoardState';
import { Button, MenuItem, Select } from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import CreateIcon from '@material-ui/icons/Create';

const boardColumns = [
  { key: 'numbering', title: '글번호', width: '5%' },
  { key: 'title', title: '제목', width: '50%' },
  { key: 'writer', title: '작성자', width: '20%' },
  { key: 'date', title: '작성일', width: '15%' },
  { key: 'hit', title: '조회수', width: '5%' },
  { key: 'recommend', title: '추천수', width: '5%' },
];

const filterButtonValues: Array<{key:FilterType, text: string, color: string}> = [
  {key: 'all', text: '전체글', color: 'primary'},
  {key: 'notice', text: '공지글', color: 'default'},
  {key: 'recommended', text: '추천글', color:'secondary'},
];

interface BoardProps{
  platform: 'afreeca' | 'twitch',
  take?: number,
  title?:String,
  select?: Array<number>,
  selectValue?:number,
  handleSelectChange?: (event: React.ChangeEvent<{
    name?: string | undefined;
    value: unknown;
}>, child: React.ReactNode) => void
}
export default function BoardContainer({
  platform, 
  take=10, 
  title, 
  select=[10,20],
  selectValue=10,
  handleSelectChange= () => {}
}:BoardProps): JSX.Element {
  const {posts, setPosts, page, setPage,
    totalRows, setTotalRows, 
    // currentPostId, setCurrentPostId,
    filter, setFilter, pagenationHandler,
  } = useBoardState();
  const history = useHistory();

  const url = useMemo(() => {
    return `/community/posts?platform=${platform}&category=${filter}&page=${page}&take=${take}`
  }, [filter,platform,page, take])

  const [{loading}, getPostList] = useAxios({ url}, { manual: true });
  
  useEffect(() => {
    // console.log('request');
    getPostList().then((res) => {
      const { posts: loadedPosts, total: loadedTotal } = res.data;
      // console.log(loadedPosts);
      setTotalRows(loadedTotal);
      setPosts(loadedPosts);
    }).catch((e) => {
      console.error(e);
    });
  }, [filter,platform,page, take]);

  const postFilterHandler = (event: React.MouseEvent<HTMLElement>,categoryFilter:FilterType) => {
    // console.log({categoryFilter,event});
    if (categoryFilter !== null){
      setFilter(categoryFilter);
    }
  }

  const moveToWritePage = (event: React.MouseEvent<HTMLElement>) => {
    history.push({
      pathname: '/community-board/write',
      state: { platform },
    })
  }

  
  // height 고정
  return (
    <div className="boardContainer" style={{height:'700px'}}>
      <div className="header">
        <div className="title">{platform} {title}</div>
        <div className="controls">
          <ToggleButtonGroup
            value={filter}
            onChange={postFilterHandler}
            exclusive>
            {filterButtonValues.map(btn => (
                <ToggleButton 
                value={btn.key}
                key={btn.key}>{btn.text}</ToggleButton>
                ))}
          </ToggleButtonGroup>

          <div>
            <select className="postPerPageSelectBox">
              {select.map((val) => (<option key={val}>{`${val}개`}</option>))}
            </select>
            <Select
            variant="outlined"
          value={selectValue}
          onChange={handleSelectChange}
        >
          {select.map(val => (
            <MenuItem key={val} value={val}>{val}</MenuItem>
          ))}
        </Select>
            <Button variant="contained" color="primary" onClick={moveToWritePage}><CreateIcon/></Button>
          </div>
        </div>
      </div>

      <PostList 
        boardColumns={boardColumns}
        posts={posts}
        total={totalRows}
        page={page}
        take={take}
        loading={loading}
      />

      <Pagination 
      shape="rounded" 
      size="small" 
      count={Math.ceil(totalRows / take)} 
      onChange={pagenationHandler}
      />

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