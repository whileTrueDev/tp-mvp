import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Rating, RatingProps } from '@material-ui/lab';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';
import { Typography, Tooltip } from '@material-ui/core';

const useRatingStyle = makeStyles((theme: Theme) => {
  const labelFontSize = theme.typography.body2.fontSize;

  return createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      '&.with-label': {
        paddingTop: theme.spacing(2.5),
      },
    },
    label: {
      position: 'absolute',
      top: 0,
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
    },
  });
});

export interface StarRatingProps{
  /** 10점 만점으로 들어오는 점수 */
 score: number | null;
 /** true이면 별점 수정이 불가능하다, 평가, 수정, 취소버튼도 뜨지않음 */
 readOnly?: boolean;
 /** 
- score는 null이거나 0~5 사이의 값임
- 서버에 값을 보낼때는 score * 2해서 보내기
- null일경우 처리 따로 해야함
*/
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
 * 10점 만점으로 함, 별 0.5개가 1점, 별 5개가 10점
 * @param param0 
 * @returns 
 */
export default function StarRating({
  score = null,
  readOnly = false,
  cancelRatingHandler,
  createRatingHandler,
  ratingProps,
}: StarRatingProps): JSX.Element {
  const classes = useRatingStyle();

  // 점수는 10점 만점으로 들어오므로 Rating컴포넌트 value로 넘겨주기 위해서는 나누기 2 해야함
  const [value, setValue] = useState<number|null>(score ? (score / 2) : null); // rating컴포넌트에 표시될 점수

  const onChange = useCallback((event, newValue: number|null) => {
    if (newValue === null) { // 서버로 보낼 평점 취소 요청
      if (cancelRatingHandler) {
        cancelRatingHandler();
      }
    } else if (createRatingHandler) {
      createRatingHandler(newValue ? (newValue * 2) : null);
    }
    setValue(newValue);
  }, [cancelRatingHandler, createRatingHandler]);

  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  // 현재 매긴 평점과 같은 점수에 마우스 올렸을 때 '취소하기'툴팁 보여준다
  const onChangeActive = useCallback((event, hoverValue: number) => {
    if (value !== null && value === hoverValue) {
      setTooltipOpen(true);
    } else {
      setTooltipOpen(false);
    }
  }, [value]);

  useEffect(() => {
    setValue(score ? (score / 2) : null);
  }, [score]);

  return (
    <div className={classnames(classes.container, { 'with-label': !readOnly })}>
      {!readOnly && (
        <Typography className={classes.label}>
          {value !== null ? labels[value] : '평가하기'}
        </Typography>
      )}
      <Tooltip open={tooltipOpen} title="취소하기" arrow placement="right-start">
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

    </div>
  );
}
