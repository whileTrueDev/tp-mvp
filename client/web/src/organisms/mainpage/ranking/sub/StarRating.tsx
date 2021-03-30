import React, { useCallback, useState } from 'react';
import { Rating } from '@material-ui/lab';
import { Button } from '@material-ui/core';

export interface StarRatingProps {
  /** 10점 만점으로 들어오는 점수 */
 score: number | null;
 readOnly: boolean;
}

/**
 * 10점 만점으로 함, 별 0.5개가 1점, 별 5개가 10점
 * @param param0 
 * @returns 
 */
export default function StarRating({
  score = null,
  readOnly = false,
}: StarRatingProps): JSX.Element {
  // 점수는 10점 만점으로 들어오므로 Rating컴포넌트 value로 넘겨주기 위해서는 나누기 2 해야함
  const [value, setValue] = useState<number|null>(score ? score / 2 : null);
  const onChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <div>
      <Rating
        name="half-rating"
        value={value}
        onChange={onChange}
        precision={0.5}
        readOnly={readOnly}
      />
      {!readOnly && (
        score
          ? (
            <>
              <Button>수정하기</Button>
              <Button>취소하기</Button>
            </>
          )
          : (<Button>평가하기</Button>)
      )}
    </div>
  );
}
