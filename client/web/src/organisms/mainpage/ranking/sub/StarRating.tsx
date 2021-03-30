import React from 'react';
import { Rating } from '@material-ui/lab';

export interface StarRatingProps {
 score: number
}

export default function StarRating({ score = 2.5 }: StarRatingProps): JSX.Element {
  return (
    <Rating name="half-rating" defaultValue={score} precision={0.5} />
  );
}
