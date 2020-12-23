import React from 'react';
import useAxios from 'axios-hooks';
import Suggest from '../organisms/suggest/Suggest';
import ReplySet from '../organisms/adminSet/ReplySet';

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

  /*
    기능제안글 가져오기 요청
 */
  const [{ loading: suggestionLoading, data: getData }, suggestreload] = useAxios(
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
