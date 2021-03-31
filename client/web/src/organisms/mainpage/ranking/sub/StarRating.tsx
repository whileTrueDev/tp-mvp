import React, {
  useCallback, useEffect, useState,
} from 'react';
import { Rating, RatingProps } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import classnames from 'classnames';

const useRatingStyle = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    '&>*+*': {
      marginLeft: theme.spacing(1),
    },
  },
  rating: {
    marginRight: theme.spacing(1),
  },
}));

export interface StarRatingProps{
  /** 10점 만점으로 들어오는 점수 */
 score: number | null;
 /** true이면 별점 수정이 불가능하다, 평가, 수정, 취소버튼도 뜨지않음 */
 readOnly?: boolean;
 /** 
- **editRatingHandler, createRatingHandler 에 해당**
- score는 null이거나 0~5 사이의 값임
- 서버에 값을 보낼때는 score * 2해서 보내기
- null일경우 처리 따로 해야함
*/
 editRatingHandler? : (score: number|null) => void;
 createRatingHandler? : (score: number|null) => void;
 /** 평점 취소 핸들러 */
 cancelRatingHandler? : () => void;
 /** Rating 컴포넌트에 적용될 prop 객체 */
 ratingProps?: Partial<RatingProps>;
}

/**
 * 10점 만점으로 함, 별 0.5개가 1점, 별 5개가 10점
 * @param param0 
 * @returns 
 */
export default function StarRating({
  score = null,
  readOnly = false,
  editRatingHandler,
  cancelRatingHandler,
  createRatingHandler,
  ratingProps,
}: StarRatingProps): JSX.Element {
  const classes = useRatingStyle();
  // 점수는 10점 만점으로 들어오므로 Rating컴포넌트 value로 넘겨주기 위해서는 나누기 2 해야함
  const [value, setValue] = useState<number|null>(score ? (score / 2) : null);
  const [evaluated, setEvaluated] = useState<boolean>(score !== null);

  const onChange = useCallback((event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  }, []);

  useEffect(() => {
    setValue(score ? (score / 2) : null);
    setEvaluated(score !== null);
  }, [score]);

  const onCancel = useCallback(() => {
    if (cancelRatingHandler) {
      // 서버로 보낼 평점 취소 요청
      cancelRatingHandler();
    }
    setValue(null);
    setEvaluated(false);
  }, [cancelRatingHandler]);

  const onEdit = useCallback(() => {
    console.log(value, 'onedit');
    if (value) {
      setEvaluated(true);
    }
    if (editRatingHandler) {
      editRatingHandler(value ? (value * 2) : null);
    }
  }, [editRatingHandler, value]);

  const onCreate = useCallback(() => {
    console.log(value, 'on create');
    if (value) {
      setEvaluated(true);
    }

    if (createRatingHandler) {
      createRatingHandler(value ? (value * 2) : null);
    }
  }, [createRatingHandler, value]);

  return (
    <div className={classes.container}>

      <Rating
        {...ratingProps}
        name="half-rating"
        value={value}
        onChange={onChange}
        precision={readOnly ? 0.1 : 0.5}
        readOnly={readOnly}
        className={classnames(classes.rating)}
      />
      {!readOnly && (
        evaluated
          ? (
            <div className={classes.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                onClick={onEdit}
              >
                수정
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onCancel}
              >
                취소
              </Button>
            </div>
          )
          : (
            <Button
              variant="contained"
              color="primary"
              onClick={onCreate}
            >
              평가하기
            </Button>
          )
      )}
    </div>
  );
}
