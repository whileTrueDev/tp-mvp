import React from 'react';
import { Card, CardHeader, CardContent, Typography, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    cardWrapper: {
        borderTopRightRadius: '0px' ,
        borderTopLeftRadius: '0px' ,
        borderBottomRightRadius: '12px',
        borderBottomLeftRadius: '12px', 
        width: '294px', 
        minHeight: '134px',
        boxShadow : "none"
    },
    cardTitleWrapper:{
        width: "100%", 
        backgroundColor:"#b5b5b5", 
        height: '46px',
    },
    cardBodyWrapper: {
        width: "100%", 
        backgroundColor:"#e7ebef", 
        minHeight: '89px',
        paddingTop: "11px",
        paddingBottom: '11px'
    },
    cardTitle: {
        fontSize: '22px', 
        marginLeft: '13px', 
        fontWeight: 'bold',
        fontFamily: 'SourceSansPro',
        color: '#4d4f5c',
        lineHeight: '1.5',
        overflow: "auto",
    },
    cardBody: {
        fontSize: '22px', 
        marginLeft: '20px',
        fontFamily: 'SourceSansPro',
        color: '#4d4f5c',
        lineHeight: '1.5',
        overflow: "auto"
    },
  }));

interface StreamCardProps {
    title: string;
    startedAt: Date;
    airTime: number;
    base? : true;
}

export default function StreamCard(props: StreamCardProps): JSX.Element{
    const { title, startedAt, airTime, base } = props;
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

    return(
        <Card className={classes.cardWrapper}>
            <CardContent style={{padding: '0px'}}>
                <Grid container alignContent="center" className={classes.cardTitleWrapper}>
                    <Grid item>
                        <Typography variant="body1" className={classes.cardTitle}>
                            {base? "기준 방송" : "비교 방송"}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container alignContent="center" className={classes.cardBodyWrapper}>
                    <Grid item>
                        <Typography className={classes.cardBody} display="block">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.cardBody}>
                            {airTimeFormmater(startedAt, airTime)}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}