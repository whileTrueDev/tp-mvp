import { Typography } from '@material-ui/core';
import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import getPlatformColor from '../../../../utils/getPlatformColor';

const useHeaderStyle = makeStyles((theme:Theme) => {
  const buttonSize = theme.typography.h1.fontSize;

  return createStyles({
    wrapper: {
      position: 'absolute',
      zIndex: 10,
      transform: `translate(${buttonSize}, ${theme.spacing(2)}px)`,
    },
    title:{
      fontSize: theme.typography.h6.fontSize
    },
    subTitle:{
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      '& > *:not(last-child)':{
        marginRight: theme.spacing(1)
      }
    },
    afreeca: {
      color: getPlatformColor('afreeca')
    },
    twitch: {
      color: getPlatformColor('twitch')
    }
  })
})

export interface CarouselItemHeaderProps extends React.HTMLAttributes<HTMLDivElement>{
  title: string;
}
function CarouselItemHeader(props: CarouselItemHeaderProps):JSX.Element{
  const {title, className, ...rest} = props;
  const classes = useHeaderStyle();
  return (
  <div className={`${classes.wrapper} ${className}`} {...rest}>
    <Typography className={classes.title}>{title}</Typography>
    <Typography className={classes.subTitle}>
      <span className={classes.afreeca}>아프리카TV</span>
      <span>VS</span>
      <span className={classes.twitch}>트위치TV</span>
    </Typography>
  </div>
  );
}

export default CarouselItemHeader;