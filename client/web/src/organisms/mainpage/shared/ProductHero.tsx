import React from 'react';
import { Container, Button } from '@material-ui/core';
import shortid from 'shortid';
import styles from './ProductHero.style';

export interface ProductHeroProps {
  title?: string;
  content?: string;
  learnMoreOnClick?: () => void;
}
export default function ProductHero({
  title, content, learnMoreOnClick,
}: ProductHeroProps): JSX.Element {
  const classes = styles();

  return (
    <div className={classes.root}>
      <Container className={classes.wraper}>
        <div className={classes.heroLogo} />
        <div className={classes.main}>
          {title && title.split('\n').map((row) => (
            <h1 key={shortid.generate()} className={classes.mainTitle}>{row}</h1>
          ))}
        </div>
        <div className={classes.main}>
          {content && content.split('\n').map((row) => (
            <p key={shortid.generate()} className={classes.mainContent}>{row}</p>
          ))}
        </div>
        {learnMoreOnClick && (
          <div className={classes.mainExcept}>
            <Button
              className={classes.button}
              onClick={() => {
                learnMoreOnClick();
              }}
            >
              자세히 보기
            </Button>
            <div className={classes.buttonLine} />
            <div className={classes.logoEffect} />
          </div>
        )}
      </Container>
    </div>
  );
}
