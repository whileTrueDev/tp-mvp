import React from 'react';
import { Word } from 'react-wordcloud';

interface CommentComparePropsType extends Record<string, any>{
  negativeWords: Word[],
  positiveWords: Word[]
}
export default function CommentsCompare(props: CommentComparePropsType): JSX.Element {
  const { negativeWords, positiveWords } = props;
  return (
    <div>
      <div>
        <p>긍정단어</p>
        <pre>{JSON.stringify(positiveWords)}</pre>
      </div>
      <div>
        <p>부정단어</p>
        <pre>{JSON.stringify(negativeWords)}</pre>
      </div>
    </div>
  );
}
