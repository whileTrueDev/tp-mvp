import React from 'react';
import {
  makeStyles, createStyles, Tooltip, Typography,
} from '@material-ui/core';
import shortid from 'shortid';

/**
 * @description customTooltip을 위한 컴포넌트
 * props 설명
 * 1. postion : 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top' 중 하나.
 * 2. stepTitle : 툴팁의 머리의 말 텍스트
 * 3. content : tooltip 내부 텍스트
 * 4. width? : 툴팁의 wdith를 변경하고 싶은 경우 사용
 */

interface StepGuideProps {
  position: 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';
  stepTitle: string;
  content: string;
  width?: number;
  children: React.ReactNode;
  [rest: string]: any;
}

export default function StepGuide(props: StepGuideProps): JSX.Element {
  const {
    position, stepTitle, content, width = 250, children, ...rest
  } = props;

  const useToolTipStyle = makeStyles((theme) => createStyles({
    toolTip: {
      width: `${width}px`,
      fontSize: 20,
      color: theme.palette.common.white,
      textAlign: 'center',
      backgroundColor: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
    tooltipWrapper: {
      position: 'relative',
    },
    stepTitle: {
      position: 'absolute',
      left: 0,
      top: '-1.1em',
      color: theme.palette.secondary.main,
      fontFamily: 'AppleSDGothicNeoB',
      fontWeight: theme.typography.fontWeightBold,
      fontSize: 25,
      padding: 0,
    },
    arrow: {
      color: theme.palette.secondary.main,
    },
    content: {
      fontWeight: theme.typography.fontWeightBold,
    },
    popper: {
      zIndex: 1,
    },
    childrenWrapper: {

    },
  }));
  const classes = useToolTipStyle();

  return (
    <Tooltip
      classes={{ tooltip: classes.toolTip, arrow: classes.arrow, popper: classes.popper }}
      placement={position}
      PopperProps={{
        disablePortal: true,
        modifiers: {
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: false,
          },
          hide: {
            enabled: false,
          },
        },
      }}
      open
      title={(
        <>
          <div className={classes.tooltipWrapper}>
            <div className={classes.stepTitle}>
              {stepTitle.toUpperCase()}
            </div>
            {content.split('\n').map((text) => (
              <Typography key={shortid.generate()} color="inherit" variant="subtitle1" className={classes.content}>
                {text}
              </Typography>
            ))}
          </div>
        </>
      )}
      arrow
      {...rest}
    >
      <div>
        {children}
      </div>
    </Tooltip>
  );
}
