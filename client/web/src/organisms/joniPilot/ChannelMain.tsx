import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import ChannelLineChart from './ChannelLineChart';
import dummyData from './dummyData.json';

export default function ChannelMain(): JSX.Element {
  const [value, setValue] = useState<string>('viewer'); // viewer, fan, likeCount, commentCount
  return (
    <>
      <div> channel main</div>

      <div>
        <Button variant="outlined" onClick={() => setValue('viewer')}>조회수</Button>
        <Button variant="outlined" onClick={() => setValue('fan')}>구독자 수</Button>
        <Button variant="outlined" onClick={() => setValue('likeCount')}>좋아요 수</Button>
        <Button variant="outlined" onClick={() => setValue('commentCount')}>댓글 수</Button>
      </div>
      <ChannelLineChart data={dummyData} category={value} />
    </>
  );
}
