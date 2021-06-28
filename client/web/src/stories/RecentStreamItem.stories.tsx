import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';
import RecentStreamListItem, { RecentStreamListItemProps } from '../organisms/mainpage/ranking/streamInfo/RecentStreamListItem';

export default {
  decorators: [
    (story) => (<MemoryRouter>{story()}</MemoryRouter>),
  ],
  title: 'organisms/RecentStreamListItem',
  component: RecentStreamListItem,
} as Meta;

const Template: Story<RecentStreamListItemProps> = (args) => <RecentStreamListItem {...args} />;

const RECENT_STREAM_DATA = {
  streamId: '42358077230',
  title: '일요일의 철면수심',
  startDate: '2021-04-18 18:04:57',
  endDate: '2021-04-18 19:34:32',
  chatCount: 1234,
  viewer: 1819,
  marginLeft: 20,
  height: 80,
  likeCount: 1,
  hateCount: 1,
  scores: {
    smile: 3.8,
    frustrate: 2.2,
    admire: 8.7,
    cuss: 1.44444,
  },
};
const defaultArgs: RecentStreamListItemProps = {
  onClick: () => alert('click handler'),
  stream: {
    ...RECENT_STREAM_DATA,
  },
};

export const Default = Template.bind({});
Default.args = defaultArgs;

const longTitleArgs: RecentStreamListItemProps = {
  onClick: () => alert('click handler'),
  stream: {
    ...RECENT_STREAM_DATA,
    title: '?랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자',
  },
};

export const LongTitle = Template.bind({});
LongTitle.args = longTitleArgs;

const bigVoteArgs: RecentStreamListItemProps = {
  onClick: () => alert('click handler'),
  stream: {
    ...RECENT_STREAM_DATA,
    title: '방송제목123123',
    likeCount: 100000000,
    hateCount: 100000000,
  },
};

export const BigVote = Template.bind({});
BigVote.args = bigVoteArgs;
