import React from 'react';
import useAxios from 'axios-hooks';
import { FeatureSuggestion } from '@truepoint/shared/dist/interfaces/FeatureSuggestion.interface';
import Suggest from '../organisms/suggest/Suggest';
import ReplySet from '../organisms/adminSet/ReplySet';

/*
AdminSuggest
**********************************************************************************
<개요>
기능제안 에대한 최상위 부모 컴포넌트 입니다.
<백엔드로요청>
 url: '/feature-suggestion', method: 'GET'
**********************************************************************************
1. 백엔드로 data get 요청을 보냅니다.
2. Suggest 컴포넌트와, replymode에서 나타나는 ReplySet이 위치합니다.
**********************************************************************************
 */
export default function AdminSuggest(): JSX.Element {
  /*
    기능제안 답변글 가져오기 요청
   */
  const [replyMode, setReplyViewMode] = React.useState(false);
  function ReplyModeOn() {
    setReplyViewMode(true);
  }
  function ReplyModeOff() {
    setReplyViewMode(false);
  }
  const [suggestionId, setSuggestionId] = React.useState();

  function handleSuggestionId(id: any) {
    setSuggestionId(id);
  }

  const [{ loading: suggestionLoading, data: getData }, suggestreload] = useAxios<FeatureSuggestion[]>(
    { url: '/feature-suggestion', method: 'GET' },
  );

  return (
    <div>
      <Suggest
        setSuggestionId={handleSuggestionId}
        ReplyModeOff={ReplyModeOff}
        ReplyModeOn={ReplyModeOn}
        suggestData={getData}
        handleReplyModeOff={ReplyModeOff}
        reload={suggestreload}
        suggestionLoading={suggestionLoading}
      />
      {replyMode && <ReplySet suggestionId={suggestionId} />}
    </div>
  );
}
