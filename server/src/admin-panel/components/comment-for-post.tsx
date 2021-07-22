import React from 'react';
import axios from 'axios';
import getApiHost from '../../utils/getApiHost';

type Props = Record<string, any>

const CreateCommentForPost = ({ record }: Props): JSX.Element => {
  const { params } = record;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = form.textarea.value.trim();

    if (!content) {
      alert('내용을 작성해주세요');
      return;
    }
    axios({
      url: `${getApiHost()}/community/posts/${params.postId}/replies`,
      method: 'post',
      data: {
        userId: 'Truepoint',
        nickname: '관리자',
        password: '',
        content: form.textarea.value,
      },
    }).then(() => {
      form.textarea.value = '';
      alert('작성 성공');
    })
      .catch((error) => {
        console.error(error);
        alert('작성 실패');
      });
  };

  return (
    <form style={{ marginBottom: 32 }} onSubmit={onSubmit}>
      <p>해당 글에 관리자로 댓글 달기</p>
      <textarea name="textarea" maxLength={100} style={{ width: '100%', resize: 'none', padding: 8 }} />
      <button type="submit">댓글 달기</button>
    </form>

  );
};

export default CreateCommentForPost;
