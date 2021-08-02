import React from 'react';
import getFrontHost from '../../utils/getFrontHost';

type Props = Record<string, any>

const CreatorCommentLink = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const { creatorId } = params;

  const href = `${getFrontHost()}/ranking/creator/${creatorId}`;

  return (
    <div style={{ marginBottom: '24px' }}>
      <a href={href} target="_blank" rel="noreferrer">{creatorId}</a>
    </div>

  );
};

export default CreatorCommentLink;
