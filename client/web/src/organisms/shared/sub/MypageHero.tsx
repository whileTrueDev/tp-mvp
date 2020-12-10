import classnames from 'classnames';
import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import Card from '../../../atoms/Card/Card';

interface ContentType {
  cardHeader: string,
  cardTitle: string,
  cardIcon: string,
  cardText: string
}

interface MypageHeroProps {
  textSource: {eachCardContent: ContentType[]}
}

const style = makeStyles((theme) => ({
  heroWraper: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
  },
  leftCard: {
    boxShadow: theme.shadows[0],
    margin: `0px ${theme.spacing(3)}px 0px 0px`,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
  },
  middleCard: {
    boxShadow: theme.shadows[0],
    margin: `0px ${theme.spacing(3)}px`,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.dark,
  },
  rightCard: {
    boxShadow: theme.shadows[0],
    margin: `0px 0px 0px ${theme.spacing(3)}px`,
    padding: theme.spacing(3),
    backgroundColor: '#d3d19d',
  },
  bold: { fontWeight: 'bold' },
  fonts: {
    color: theme.palette.common.white,
  },
  image: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    margin: theme.spacing(1),
  },
  textWraper: { marginTop: theme.spacing(1) },
}));

export default function MypageHero(
  { textSource }: MypageHeroProps,
): JSX.Element {
  const classes = style();
  function cardType(index: number): string {
    let className;
    if (index === 0) {
      className = classes.leftCard;
    } else if (index === 1) {
      className = classes.middleCard;
    } else {
      className = classes.rightCard;
    }
    return className;
  }

  return (
    <section className={classes.heroWraper}>
      {textSource.eachCardContent.map((content, index) => (
        <Card className={cardType(index)} key={content.cardText}>
          <div className={classes.image}>
            <img src={content.cardIcon} height={35} alt="cardIcon" draggable={false} />
          </div>
          <Typography className={classnames(classes.fonts, classes.bold)} variant="body2">
            {content.cardHeader}
          </Typography>
          {content.cardTitle.split('\n').map((title: string) => (
            <Typography key={title} variant="h6" className={classnames(classes.fonts, classes.bold)}>{title}</Typography>
          ))}
          <div className={classes.textWraper}>
            {content.cardText.split('\n').map((text) => (
              <Typography key={text} className={classes.fonts} variant="body2" color="textSecondary">
                {text}
              </Typography>
            ))}
          </div>
        </Card>
      ))}
    </section>
  );
}
