import React from 'react';
import { Story, Meta } from '@storybook/react';
import CommentItem, { CommentItemProps } from '../organisms/mainpage/ranking/sub/CommentItem';

export default {
  title: 'organisms/CreatorCommentItem',
  component: CommentItem,
} as Meta;

const Template: Story<CommentItemProps> = (args) => <CommentItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  targetId: 1,
  creatorId: 'bht0205',
  userId: undefined,
  nickname: '댓글 테스트',
  content: '테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다',
  createDate: new Date(),
  likesCount: 10,
  hatesCount: 0,
};
