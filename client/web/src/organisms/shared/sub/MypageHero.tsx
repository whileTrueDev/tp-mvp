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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paper: {
    backgroundColor: theme.palette.grey[400],
  },
  leftCard: {
    margin: `0px ${theme.spacing(3)}px 0px 0px`,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
  },
  middleCard: {
    margin: `0px ${theme.spacing(3)}px`,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.dark,
  },
  rightCard: {
    margin: `0px 0px 0px ${theme.spacing(3)}px`,
    padding: theme.spacing(3),
    backgroundColor: '#d3d19d',
  },
  fonts: {
    fontWeight: 'bold',
    color: theme.palette.common.white,
  },
  image: {
    marginTop: theme.spacing(1),
    margin: theme.spacing(1),
  },
  textWraper: {
    marginTop: theme.spacing(2),
  },
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
        <Card className={cardType(index)}>
          <Typography className={classes.fonts} variant="body1">
            {content.cardHeader}
          </Typography>
          <div className={classes.image}>
            <img src={content.cardIcon} width="15%" alt="cardIcon" />
          </div>
          {content.cardTitle.split('\n').map((title: string) => (
            <Typography variant="h4" className={classes.fonts}>{title}</Typography>
          ))}
          <div className={classes.textWraper}>
            {content.cardText.split('\n').map((text) => (
              <Typography className={classes.fonts} variant="body2">
                {text}
              </Typography>
            ))}
          </div>
        </Card>
      ))}
    </section>
  );
}
