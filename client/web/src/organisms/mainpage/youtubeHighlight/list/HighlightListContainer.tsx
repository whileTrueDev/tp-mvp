import React, { useEffect, useMemo } from 'react';

import {
  makeStyles, createStyles,
} from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import { HighlightPointListResType } from '@truepoint/shared/dist/res/HighlightPointListResType.interface';
import HighlightlistTable from './HighlightListTable';

const useStyles = makeStyles(() => createStyles({
  root: {
    height: '100%',
    width: '100%',
  },
}));

interface HighlightListProps{
  platform: 'afreeca' | 'twitch',
  titleComponent?: JSX.Element
}

export default function HighlightListContainer({
  platform,
  titleComponent,
}: HighlightListProps): JSX.Element {
  const classes = useStyles();
  const url = useMemo(() => `/highlight/highlight-point-list/${platform}`, [platform]);

  const [{ loading, data }, getList] = useAxios<HighlightPointListResType[]>({ url }, { manual: true });

  useEffect(() => {
    getList().then((res) => {
      // setList(res.data);
    }).catch((e) => {
      console.error(e);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <HighlightlistTable
        posts={data || []}
        loading={loading}
        titleComponent={titleComponent}
      />
    </div>
  );
}
