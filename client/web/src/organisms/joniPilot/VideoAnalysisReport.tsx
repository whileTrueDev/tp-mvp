import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Chip, Container,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import { fakeVideoItemType } from './VideoAnalysis';

interface StyleProps{
  [key: string]: string;
}
interface InfoItemProps{
  label: string;
  data: string;
  caption: string;
  style?: StyleProps,
  children?: JSX.Element[] | JSX.Element | null
}

const useInfoItemComponentStyles = makeStyles((theme: Theme) => createStyles({
  dataText: (props: StyleProps) => ({
    fontFamily: 'SourceSansPro-Bold',
    color: props.dataTextColor,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    marginRight: theme.spacing(1),
  }),
  captionText: {
    fontFamily: 'SourceSansPro-Regular',
  },
}));

// 분석보고서 조회수, 좋아요, 댓글수 정보 표시하기 위한 컴포넌트
function InfoItemComponent(prop: InfoItemProps): JSX.Element {
  const {
    label, data, caption, style,
  } = prop;
  const classes = useInfoItemComponentStyles(style);
  return (
    <>
      <Typography component="h5">{label}</Typography>
      <Grid container direction="row" alignItems="baseline">
        <Typography component="h3" className={classes.dataText}>{data}</Typography>
        <Typography variant="caption" className={classes.captionText}>{caption}</Typography>
      </Grid>
    </>
  );
}

// 10000 -> 10,000 로 숫자 , 적용
function formatNumByComma(number: number): string {
  return number.toLocaleString();
}

// (좋아요/싫어요) 퍼센트 리턴
function formatRatioLikesHates(likes: number, hates: number): string {
  return ((likes / hates) * 100).toFixed(0);
}

const useReportSectionStyle = makeStyles((theme: Theme) => createStyles({
  thumbnailContainer: {
    '&>img': {
      width: '100%',
      maxWidth: '415px',
      objectFit: 'fill',
    },
  },
  reportContainer: {
    '&>*': {
      marginBottom: theme.spacing(1.5),
    },
  },
  itemContainer: {
    color: '#4d4d4d',
    '& h5': {
      color: 'rgba(77, 77, 77,0.5)',
    },
    marginBottom: theme.spacing(1),
  },
  chip: {
    backgroundColor: '#6f78bc',
    color: theme.palette.grey[50],
    marginRight: theme.spacing(4.5),
    padding: '1em 0.5em',
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
}));
interface VideoAnalysisReportProps{
  data: fakeVideoItemType;
  [key: string]: any;
}

export default function VideoAnalysisReport(props: VideoAnalysisReportProps): JSX.Element {
  const { data } = props;
  const classes = useReportSectionStyle();

  const infoItems = useMemo(() => ([
    {
      label: '조회수',
      data: `${formatNumByComma(data.views)}`,
      caption: '수',
    },
    {
      label: '좋아요',
      data: `${formatRatioLikesHates(data.likes, data.hates)} %`,
      caption: `${`(${data.likes}/${data.hates})`}`,
      style: {
        dataTextColor: '#6f78bc',
      },
    },
    {
      label: '댓글수',
      data: `${formatNumByComma(data.comments)}`,
      caption: '개',
    },
  ]), [data]);

  return (
    <ChannelAnalysisSectionLayout
      title="동영상 분석 보고서"
      tooltip="동영상 분석 보고서~~~"
    >
      <Grid container>

        <Grid item xs={12} sm={4} className={classes.thumbnailContainer}>
          <img src={`${data.thumbnail}/default.jpg`} alt={data.title} />
        </Grid>

        <Grid item xs={12} sm={8} className={classes.reportContainer}>
          <Box>
            <Typography variant="h5">{data.title}</Typography>
            <Typography variant="subtitle1">{new Date(data.endDate).toISOString().split('T')[0]}</Typography>
          </Box>

          <Grid container>
            {infoItems.map((item) => (
              <Grid item xs={4} className={classes.itemContainer}>
                <InfoItemComponent
                  label={item.label}
                  data={item.data}
                  caption={item.caption}
                  style={item.style}
                />
              </Grid>
            ))}
            <Grid item xs={12} className={classes.itemContainer}>
              <Typography component="h5" gutterBottom>설정태그</Typography>
              <Container>
                {data.tags.map((tag) => (
                  <Chip className={classes.chip} label={tag} />
                ))}
              </Container>
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </ChannelAnalysisSectionLayout>
  );
}
