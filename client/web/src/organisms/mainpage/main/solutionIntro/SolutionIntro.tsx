import { Container } from '@material-ui/core';
import React from 'react';
import shortid from 'shortid';
import styles from '../style/SolutionIntro.style';
import source from '../source/textsource';

export default function SolutionIntro(): JSX.Element {
  const classes = styles();

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.mainTitle}>트루포인트 방송분석 주요기능</div>
        <div className={classes.solutionWraper}>

          <div className={classes.solution}>
            <img src="/images/main/solutionfirst.svg" alt="solutionFirst" className={classes.stepSVG} />
            <div className={classes.mainContent}>
              <div className={classes.eachTitle}>
                {source.solutionIntro.title.stepOne}
              </div>
              {source.solutionIntro.content.stepOne.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.eachContent}>{row}</p>
              ))}
            </div>
            <div className={classes.stepOneLine} />
          </div>

          <div className={classes.solution}>
            <div className={classes.stepTwoLine} />
            <div className={classes.mainContent}>
              <div className={classes.eachTitle}>
                {source.solutionIntro.title.stepTwo}
              </div>
              {source.solutionIntro.content.stepTwo.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.eachContent}>{row}</p>
              ))}
            </div>
            <img src="/images/main/solutionsecond.svg" alt="solutionSecond" className={classes.stepSVG} />
          </div>

          <div className={classes.solution}>
            <img src="/images/main/solutionthird.svg" alt="solutionThird" className={classes.stepSVG} />
            <div className={classes.stepThreeLine} />
            <div className={classes.mainContent}>
              <div className={classes.eachTitle}>
                {source.solutionIntro.title.stepThree}
              </div>
              {source.solutionIntro.content.stepThree.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.eachContent}>{row}</p>
              ))}

            </div>
          </div>
          <div className={classes.accent}>{source.solutionIntro.content.accent}</div>
          <div className={classes.mainBottomLine} />

          <div className={classes.finishComment}>이제, 트루포인트가 시작합니다</div>
          <div>
            <svg className={classes.arrowSVG}>
              <polyline points="0,0 25,25 50,0" />
            </svg>
          </div>
        </div>
      </Container>
    </div>
  );
}
