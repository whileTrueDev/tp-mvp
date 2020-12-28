import React from 'react';

import SuggestSet from '../adminSet/SuggestSet';

/*
ReplyModehandler
**********************************************************************************
Suggest를 위한 props입니다.
**********************************************************************************
ReplyModeOn : reply mode를 켜기위한 props입니다.
ReplyModeOff : reply mode를 끄기위한 props입니다.
suggestionLoading : loading을 위한 props입니다.
reload : reloading을 위한 props입니다.
suggestData : 기능제안데이터들에대한 props입니다.
handleReplyModeOff : 답변모드를 끄기위한 props입니다.
setSuggestionId : 기능제안글의 id를 위한 props입니다.
**********************************************************************************
 */
interface ReplyModehandler{
  ReplyModeOn: () => void;
  ReplyModeOff: () => void;
  suggestionLoading: any;
  reload: () => void;
  suggestData: any;
  handleReplyModeOff: () => void;
  setSuggestionId: (id: any) => void;
}

/*
Suggest
**********************************************************************************
기능제안 탭 에대한 최상위 부모 컴포넌트 입니다.
**********************************************************************************
1. SuggestSet이 위치합니다.
**********************************************************************************
 */
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
