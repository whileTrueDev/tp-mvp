import React from 'react';
import { Story, Meta } from '@storybook/react';
import HotPostBox, { HotPostBoxProps } from '../organisms/mainpage/communityBoard/list/HotPostBox';

export default {
  title: 'organisms/HotPostBox',
  component: HotPostBox,
  decorators: [
    // eslint-disable-next-line no-shadow
    (Story) => (
      <div style={{ padding: '5em', backgroundColor: 'blue' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const Template: Story<HotPostBoxProps> = (args) => <HotPostBox {...args} />;

const dummyPosts = [{
  postId: 54, title: 'password1234', nickname: 'asdf', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 34, recommend: 19, repliesCount: 0, postNumber: 4,
}, {
  postId: 61, title: '내용수정 테스트11sssdfsdf', nickname: '1234', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 304, recommend: 18, repliesCount: 2, postNumber: 3,
}, {
  postId: 11, title: '아프리카 게시판 글 제목', nickname: '닉네임', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 0, recommend: 17, repliesCount: 0, postNumber: 2,
}, {
  postId: 12, title: '아프리카 게시판 글 제목', nickname: '닉네임', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 0, recommend: 15, repliesCount: 0, postNumber: 1,
},
{
  postId: 14, title: '아프리카 게시판 글1 제목', nickname: '닉네임', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 0, recommend: 15, repliesCount: 0, postNumber: 1,
},
{
  postId: 15, title: '아프리카 게시판 2글 제목', nickname: '닉네임', ip: '255.255', createDate: new Date(), platform: 0, category: 0, hit: 0, recommend: 15, repliesCount: 0, postNumber: 1,
}];

export const Default = Template.bind({});
Default.args = {
  loading: false,
  error: false,
  posts: dummyPosts,
  platform: 'twitch',
};
