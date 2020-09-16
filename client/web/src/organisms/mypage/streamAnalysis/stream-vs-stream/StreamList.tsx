import React from 'react';
import {
    Paper, Typography, Grid, Divider, List, ListItem
  } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    listWrapper: {
        width: '569px',
        padding: '0px',
        maxHeight: '292px',
        overflow: 'auto'
    },
    listItem: {
        width: '100%',
        height: '50px',
        backgroundColor: '#a6c1f9',
        paddingLeft: '29.1px',
        paddingTop: '14.1px',
        paddingBottom: '13.9x',
        borderRadius: '4px'
    },
    listItemText: {
        fontFamily: 'SourceSansPro',
        color: '#4d4f5c',
        textAlign: 'left',
        lineHeight: '2.06',
        fontSize: '16px'
    }
}));

export interface DayStreamsInfo{
    streamId : string;
    title : string;
    platform: 'afreeca'|'youtube'|'twitch';
    airTime: number;
    startedAt: Date;
}

interface StreamListProps {
    dayStreamsList: DayStreamsInfo[];
}

export default function StreamList(props: StreamListProps): JSX.Element {
    const { dayStreamsList } = props;
    const classes = useStyles();

    const airTimeFormmater = (startedAt: Date, airTime: number) => {
        console.log(startedAt);
        const endAt = new Date(startedAt);
        endAt.setHours(startedAt.getHours()+airTime);
        const airTimeText = `${startedAt.getDate()}일
                             ${startedAt.getHours()}:${startedAt.getMinutes()} ~ 
                             ${endAt.getDate()}일
                             ${endAt.getHours()}:${endAt.getMinutes()}`;
        return airTimeText
    }

    return (
        <List className={classes.listWrapper}>
            {dayStreamsList.map((stream) => (
                <ListItem key={stream.streamId} className={classes.listItem}>

                  <Typography className={classes.listItemText}>
                    {airTimeFormmater(stream.startedAt, stream.airTime)}
                  </Typography>
                
                </ListItem>
              ))}
        </List>
    );
}