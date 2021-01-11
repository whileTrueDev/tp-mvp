import React, { useMemo } from 'react';
import {
  Grid, Typography, Box, Chip, Container,
} from '@material-ui/core';
import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import CountUp from 'react-countup';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import { fakeVideoItemType, TagType } from './VideoAnalysis';

interface StyleProps{
  [key: string]: string;
}
// 좋아요 부분 숫자만 색이 달라서 prop.dataTextColor로 받아옴
const useInfoItemComponentStyles = makeStyles((theme: Theme) => createStyles({
  dataText: (props: StyleProps) => ({
    color: props.dataTextColor,
    fontFamily: 'SourceSansPro-Bold',
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: '1.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
    marginRight: theme.spacing(1),
  }),
  captionText: {
    fontFamily: 'SourceSansPro-Regular',
  },
}));

// 분석보고서 조회수, 좋아요, 댓글수, 설정태그 레이블 컴포넌트
function InfoItemLabel(prop: {text: string}): JSX.Element {
  const classes = useReportSectionStyle();
  const { text } = prop;
  return (
    <Typography component="h5" gutterBottom className={classes.infoLabel}>{text}</Typography>
  );
}
// 분석보고서 조회수, 좋아요, 댓글수 숫자 부분 나타내는 컴포넌트
function InfoItemNumberDisplay(prop: {data: number, caption: string, style?: StyleProps, suffix?: string }) {
  const {
    data, caption, style, suffix,
  } = prop;
  const classes = useInfoItemComponentStyles(style);

  return (
    <Grid container direction="row" alignItems="baseline">
      <Typography component="h3" className={classes.dataText}>
        <CountUp duration={2} redraw end={data} separator="," suffix={suffix} />
      </Typography>
      <Typography variant="caption" className={classes.captionText}>{caption}</Typography>
    </Grid>
  );
}

// 분석보고서 태그 컴포넌트
function InfoItemTags(prop: {tags: TagType[]}) {
  const classes = useReportSectionStyle();
  const { tags } = prop;
  return (
    <Container>
      {tags.map((tag) => <Chip key={tag.tagId} className={classes.chip} label={tag.label} />)}
    </Container>
  );
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
    padding: theme.spacing(2),
    '&>*': {
      marginBottom: theme.spacing(1.5),
    },
  },
  itemContainer: {
    color: theme.palette.grey[800],
    marginBottom: theme.spacing(1),
  },
  infoLabel: {
    color: theme.palette.text.secondary,
  },
  chip: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.grey[50],
    marginRight: theme.spacing(4.5),
    padding: '1em 0.5em',
    transitionProperty: 'transform',
    transitionDuration: `${theme.transitions.duration.short}ms`,
    transitionTimingFunction: theme.transitions.easing.easeIn,
    '&:hover': {
      transform: 'scale(1.1)',
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
      data: data.views,
      caption: '수',
    },
    {
      label: '좋아요',
      data: Math.floor((data.likes / data.hates) * 100),
      caption: `${`(${data.likes}/${data.hates})`}`,
      suffix: '%',
      style: {
        dataTextColor: '#6f78bc',
      },
    },
    {
      label: '댓글수',
      data: data.comments,
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
          <Grid container alignContent="space-between">
            {infoItems.map((item) => (
              <Grid key={item.label} item xs={12} sm={4} className={classes.itemContainer}>
                <InfoItemLabel text={item.label} />
                <InfoItemNumberDisplay
                  data={item.data}
                  caption={item.caption}
                  style={item.style}
                  suffix={item.suffix}
                />
              </Grid>
            ))}

            <Grid item xs={12} className={classes.itemContainer}>
              <InfoItemLabel text="설정태그" />
              <InfoItemTags tags={data.tags} />
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </ChannelAnalysisSectionLayout>
  );
}
