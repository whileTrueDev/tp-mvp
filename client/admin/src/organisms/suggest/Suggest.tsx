import React from 'react';

import SuggestSet from '../adminSet/SuggestSet';

interface ReplyModehandler{
  ReplyModeOn: () => void;
  ReplyModeOff: () => void;
  suggestionLoading: any;
  reload: () => void;
  suggestData: any;
  handleReplyModeOff: () => void;
  setSuggestionId: (id: any) => void;
}

export default function Suggest(replyMode: ReplyModehandler): JSX.Element {
  const {
    ReplyModeOn, ReplyModeOff, suggestionLoading, reload, suggestData, setSuggestionId,
  } = replyMode;

  return (
    <SuggestSet
      setSuggestionId={setSuggestionId}
      ReplyModeOff={ReplyModeOff}
      ReplyModeOn={ReplyModeOn}
      tabledata={suggestData}
      suggestLoading={suggestionLoading}
      reload={reload}
    />
  );
}
