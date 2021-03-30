import React from 'react';
import { useParams } from 'react-router-dom';

// export interface CreatorEvaluationProps {

// }

export default function CreatorEvaluation(
// {}: CreatorEvaluationProps
): JSX.Element {
  const { creatorId } = useParams<{creatorId: string}>();

  return (
    <div>
      {creatorId}
      의 페이지
    </div>
  );
}
