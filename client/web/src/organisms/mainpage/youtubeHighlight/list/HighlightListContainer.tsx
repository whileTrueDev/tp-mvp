import React, { useEffect, useMemo } from 'react';

import {
  makeStyles, createStyles,
} from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { PostFound } from '@truepoint/shared/dist/res/FindPostResType.interface';
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
import PostList from './PostList';

const useStyles = makeStyles(() => createStyles({
  root: {
    height: '100%',
    width: '100%',
  },
}));

interface HighlightListProps{
  platform: 'afreeca' | 'twitch',
  setList: React.Dispatch<React.SetStateAction<any[]>>;
  boardState: {
    posts: PostFound[],
    list: EditingPointListResType[];
    page: number;
    totalRows: number;
  },
  titleComponent? : JSX.Element
}

export default function HighlightListContainer({
  platform,
  setList,
  titleComponent,
  boardState,
}: HighlightListProps): JSX.Element {
  const classes = useStyles();
  const {
    list,
  } = boardState;
  const url = useMemo(() => `/users/highlight-point-list/${platform}`, [platform]);

  const [{ loading }, getList] = useAxios({ url }, { manual: true });

  useEffect(() => {
    getList().then((res) => {
      setList(res.data);
    }).catch((e) => {
      console.error(e);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <PostList
        posts={list}
        loading={loading}
        titleComponent={titleComponent}
      />
    </div>
  );
}
