import React from 'react';
// material - ui core components
import {
  Typography, List, ListItem, IconButton
} from '@material-ui/core';
// material - ui styles
import { makeStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
// interface
import { Stream } from 'stream';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { StreamListProps, DayStreamsInfo } from './PerioudAnalysisHero.interface';

const useStyles = makeStyles((theme: Theme) => ({
  listWrapper: {
    width: '100%',
    padding: '0px',
    maxHeight: '292px',
    overflow: 'auto'
  },
  listItem: {
    width: '100%',
    height: '50px',
    backgroundColor: '#ffff',
    paddingLeft: '29.1px',
    paddingTop: '13.1px',
    paddingBottom: '13.9x',
    borderRadius: '4px',
    '&:hover,select': {
      backgroundColor: theme.palette.primary.light,
    },
    justifyContent: 'space-between'
  },
  selectedListItem: {

  },
  listItemText: {
    fontFamily: 'SourceSansPro',
    color: '#4d4f5c',
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 'bold'
  }
}));

export default function StreamList(props: StreamListProps): JSX.Element {
  const {
    // dayStreamsList, handleSeletedStreams, baseStream, compareStream,
    // handleFullMessage
    termStreamsList, handleTermStreamList
  } = props;
  const classes = useStyles();

  const [test, setTest] = React.useState<DayStreamsInfo[]>([]);

  React.useEffect(() => {
    setTest(termStreamsList);
  }, [termStreamsList]);

  const airTimeFormmater = (startDate: Date, streamLength: number) => {
    const endAt = new Date(startDate);
    endAt.setHours(startDate.getHours() + streamLength);
    const airTimeText = `${startDate.getDate()}일
                             ${startDate.getHours()}시 ${startDate.getMinutes()}분~ 
                             ${startDate.getDate()}일
                             ${endAt.getHours()}시 ${endAt.getMinutes()}분`;
    return airTimeText;
  };

  const handleRemoveButton = (removeStream: DayStreamsInfo) => {
    // const termList = termStreamsList;
    // const streamIdList = termStreamsList.map((stream) => stream.streamId);
    // const removeIndex = streamIdList.indexOf(removeStream.streamId);
    // console.log('before: ', termList);

    // return new Promise(((resolve, reject) => {
    //   termList.splice(removeIndex, 1);
    //   console.log('after: ', termList);
    //   resolve(termList);
    // }));

    const streamIdList = termStreamsList.map((stream) => stream.streamId);
    const removeIndex = streamIdList.indexOf(removeStream.streamId);
    // console.log('before: ', termList);

    const testList = test;
    testList.splice(removeIndex, 1);
    setTest(testList);
  };

  const StreamListItem = ():JSX.Element[] => test.map((stream) => (
    <ListItem
      key={stream.streamId}

        // selected={isSelectedListItem(stream)}
      className={classes.listItem}
    >
      <Typography className={classes.listItemText}>
        {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
      </Typography>
      {/* <IconButton onClick={() => handleRemoveButton(stream)
        .then((termList) => handleTermStreamList(([])))}
      > */}
      <IconButton onClick={() => {
        handleRemoveButton(stream);
        console.log(test);
      }}
      >
        <ClearOutlinedIcon />
      </IconButton>
    </ListItem>
  ));

  return (
    <List className={classes.listWrapper}>
      {/* {termStreamsList && termStreamsList.map((stream) => (
        <ListItem
          key={stream.streamId}
          button
          // selected={isSelectedListItem(stream)}
          className={classes.listItem}
          // onClick={() => handleListStreamClick(stream)}
        >
          <Typography className={classes.listItemText}>
            {airTimeFormmater(new Date(stream.startedAt), stream.airTime)}
          </Typography>
          <IconButton onClick={() => handleRemoveButton(stream)}>
            <ClearOutlinedIcon />
          </IconButton>
        </ListItem>
      ))} */}
      {StreamListItem()}
    </List>
  );
}
