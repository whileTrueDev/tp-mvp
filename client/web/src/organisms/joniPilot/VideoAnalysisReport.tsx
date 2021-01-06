import React from 'react';
import {
  Grid, Typography, Box, Chip,
} from '@material-ui/core';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import { fakeVideoItemType } from './VideoAnalysis';

interface Props{
  data: fakeVideoItemType;
  [key: string]: any;
}
export default function VideoAnalysisReport(props: Props): JSX.Element {
  const { data } = props;
  return (
    <ChannelAnalysisSectionLayout
      title="동영상 분석 보고서"
      tooltip="동영상 분석 보고서~~~"
    >
      <div>
        <Grid container>
          <Grid item xs={5}>
            <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />
            <p>
              {data.thumbnail}
            </p>
          </Grid>
          <Grid item xs={7}>
            <Box>
              <Typography>{data.title}</Typography>
              {/* <Typography>{data.endDate.split('T')[0]}</Typography> */}
            </Box>
            <Grid container>
              <Grid item xs={4}>
                <Typography>조회수</Typography>
                <Typography>{data.views}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>좋아요</Typography>
                <Typography>{data.likes}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography>댓글수</Typography>
                <Typography>{data.comments}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography>설정태그</Typography>
              {data.tags.map((tag) => (
                <Chip label={tag} disabled />
              ))}
            </Grid>

          </Grid>

        </Grid>
      </div>
    </ChannelAnalysisSectionLayout>
  );
}
