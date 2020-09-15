import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Card, CardHeader, CardContent
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', padding: 5
  },
  root: {
    width: '100%',
    heigth: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    marginBotton: '20px',
    marginTop: '20px'
  },
}));

/**
 * @param {} props iconComponent=왼쪽상단의 아이콘, buttonComponent=오른쪽 상단의 버튼
 */
interface CustomCardProps {
  iconComponent: React.ReactNode;
  secondComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
  children: React.ReactNode;
  backgroundColor?: boolean;
}
export default function CustomCard({
  iconComponent, secondComponent, buttonComponent, children, backgroundColor
}: CustomCardProps): JSX.Element {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader stats icon>
        {/* <CardIcon color="blueGray" className={backgroundColor ? ('yellowBack') : (null)}>
          {iconComponent}
        </CardIcon> */}
        {/* {secondComponent && (
          <CardIcon>
            {secondComponent}
          </CardIcon>
        )} */}
        {buttonComponent && (buttonComponent)}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
