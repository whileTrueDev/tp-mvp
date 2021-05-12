import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Rating, RatingProps } from '@material-ui/lab';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Typography, Tooltip } from '@material-ui/core';
import yellow from '@material-ui/core/colors/yellow';

const useRatingStyle = makeStyles((theme: Theme) => {
  const labelFontSize = theme.typography.body1.fontSize;

  return createStyles({
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative',
      '&.with-label': {
        paddingBottom: theme.spacing(3),
      },
    },
    label: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      fontSize: labelFontSize,
    },
    buttonGroup: {
      '&>*+*': {
        marginLeft: theme.spacing(1),
      },
    },
    rating: {
      marginRight: theme.spacing(1),
      '& .MuiRating-iconFilled': {
        color: yellow[400],
      },
    },
    tooltip: {
      fontSize: theme.typography.body1.fontSize,
    },
  });
});

export interface StarRatingProps{
  /** 5점 만점으로 들어오는 점수 */
 score: number | undefined;
 /** true이면 별점 수정이 불가능하다, 평가, 수정, 취소버튼도 뜨지않음 */
 readOnly?: boolean;
 /**  score는 null이거나 0~5 사이의 값으로 핸들러에 넘겨줘야함 */
 createRatingHandler? : (score: number|null, cb?: () => void) => void;
 /** 평점 취소 핸들러 */
 cancelRatingHandler? : (cb?: () => void) => void;
 /** Rating 컴포넌트에 적용될 prop 객체 */
 ratingProps?: Partial<RatingProps>;
}

const labels: { [index: string]: string } = {
  0.5: '최악이에요',
  1: '싫어요',
  1.5: '재미없어요',
  2: '별로예요',
  2.5: '부족해요',
  3: '보통이에요',
  3.5: '볼만해요',
  4: '재미있어요',
  4.5: '훌륭해요',
  5: '최고예요',
};

/**
 * material ui의 Rating컴포넌트와 평점 매기기, 취소, 수정 버튼이 같이 있는 컴포넌트
 * readOnly 값이 false인 경우 버튼은 보이지 않는다
 * @param  
 * @returns 
 */
export default function StarRating({
  score = undefined,
  readOnly = false,
  cancelRatingHandler,
  createRatingHandler,
  ratingProps,

}: StarRatingProps): JSX.Element {
  const classes = useRatingStyle();

  const [evaluated, setEvaluated] = useState<boolean>(score !== undefined); // 평가했는지 여부 확인
  const [value, setValue] = useState<number>(score ? score / 2 : 0); // rating컴포넌트에 표시될 점수

  const onChange = useCallback((event, newValue: number|null) => {
    if (newValue === null) { // 서버로 보낼 평점 취소 요청
      setEvaluated(false);
      if (cancelRatingHandler) {
        cancelRatingHandler();
      }
    } else if (createRatingHandler) {
      setEvaluated(true);
      createRatingHandler(newValue * 2 || null);
    }
    setValue(newValue || 0);
  }, [cancelRatingHandler, createRatingHandler]);

  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>('취소하기');
  // 현재 매긴 평점과 같은 점수에 마우스 올렸을 때 '취소하기'툴팁 보여준다
  const onChangeActive = useCallback((event, hoverValue: number) => {
    if (event.type === 'mouseleave') {
      setTooltipOpen(false);
      return;
    }
    setTooltipOpen(true);
    if (value !== null && value === hoverValue) {
      setTooltipText('취소하기');
    } else {
      setTooltipText(`${hoverValue * 2} 점`);
    }
  }, [value]);

  useEffect(() => {
    setValue(score ? score / 2 : 0);
    setEvaluated(score !== undefined);
  }, [score]);

  return (
    <div className={classnames(classes.container, { 'with-label': !readOnly })}>
      <Tooltip
        open={tooltipOpen}
        title={tooltipText}
        arrow
        placement="right-start"
        classes={{
          tooltip: classes.tooltip,
        }}
      >
        <Rating
          {...ratingProps}
          name="half-rating"
          value={value}
          onChange={onChange}
          onChangeActive={onChangeActive}
          precision={readOnly ? 0.1 : 0.5}
          readOnly={readOnly}
          className={classnames(classes.rating)}
        />
      </Tooltip>
      {!readOnly && (
        <Typography className={classes.label} color={evaluated ? 'textPrimary' : 'error'}>
          {evaluated ? labels[value] : '별점을 남겨주세요'}
        </Typography>
      )}

    </div>
  );
}
