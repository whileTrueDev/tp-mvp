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
  viewer: 1819,
  marginLeft: 20,
  height: 80,
};
const defaultArgs: RecentStreamListItemProps = {
  stream: {
    ...RECENT_STREAM_DATA,
  },
};
const longTitleArgs: RecentStreamListItemProps = {
  stream: {
    ...RECENT_STREAM_DATA,
    title: '?랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자랭크솔랭화내지말자',
  },
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const LongTitle = Template.bind({});
LongTitle.args = longTitleArgs;
