import React from 'react';
import { Story, Meta } from '@storybook/react';
import HotPostItem, { HotPostItemProps } from '../organisms/mainpage/communityBoard/list/HotPostItem';

export default {
  title: 'organisms/HotPostItem',
  component: HotPostItem,
} as Meta;

const Template: Story<HotPostItemProps> = (args) => <HotPostItem {...args} />;

export const Default = Template.bind({});
const dummyPostData = {
  postId: 13, title: '트위치 게시판 글 제목', nickname: '닉네임', ip: '255.255', createDate: new Date(), platform: 1, category: 0, hit: 2, recommend: 14, repliesCount: 1, postNumber: 1,
};
Default.args = {
  icon: <img src="images/logo/twitchLogo.png" width="32" height="32" alt="로고" />,
  post: dummyPostData,
  onClick() {
    alert(`move to postId ${dummyPostData.postId}`);
  },
};

export const LongText = Template.bind({});
LongText.args = {
  icon: <img src="images/logo/twitchLogo.png" width="32" height="32" alt="로고" />,
  post: { ...dummyPostData, title: '매우매우 긴 제목매우매우 긴 제목매우매우 긴 제목매우매우 긴 제목매우매우 긴 제목매우매우 긴 제목', nickname: '엄청긴닉네임엄청긴닉네임엄청긴닉네임엄청긴닉네임엄청긴닉네임' },
  onClick() {
    alert(`move to postId ${dummyPostData.postId}`);
  },
};
