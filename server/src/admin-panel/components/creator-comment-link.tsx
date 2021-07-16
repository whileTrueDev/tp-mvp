import React from 'react';
import getFrontHost from '../../utils/getFrontHost';

type Props = Record<string, any>

const CreatorCommentLink = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { creatorId } = params;

  const href = `${getFrontHost()}/ranking/creator/${creatorId}`;

  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ color: 'grey' }}>해당 댓글이 달린 크리에이터를 확인하려면</p>
      <a href={href} target="_blank" rel="noreferrer">크리에이터 프로필 화면으로 이동</a>
    </div>

  );
};

export default CreatorCommentLink;
