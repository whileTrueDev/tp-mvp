import React from 'react';
import { Story, Meta } from '@storybook/react';
import CreatorCommentItem, { CreatorCommentItemProps } from '../organisms/mainpage/ranking/creatorInfo/CreatorCommentItem';

export default {
  title: 'organisms/CreatorCommentItem',
  component: CreatorCommentItem,
} as Meta;

const Template: Story<CreatorCommentItemProps> = (args) => <CreatorCommentItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  commentId: 1,
  creatorId: 'bht0205',
  userId: null,
  nickname: '댓글 테스트',
  content: '테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다테스트용 댓글입니다',
  createDate: new Date(),
  likesCount: 10,
  hatesCount: 0,
};
