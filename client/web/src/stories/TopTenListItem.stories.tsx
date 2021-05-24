import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import TopTenListItem, { TopTenListItemProps } from '../organisms/mainpage/ranking/topten/TopTenListItem';

export default {
  title: 'organisms/TopTenListItem',
  component: TopTenListItem,
  decorators: [
    (story) => (<MemoryRouter>{story()}</MemoryRouter>),
  ],
} as Meta;

const Template: Story<TopTenListItemProps> = (args) => <TopTenListItem {...args} />;

const baseData = {
  id: 5246,
  creatorId: '166079347',
  creatorName: '오킹',
  title: '부들부들.. ',
  platform: 'twitch',
  averageRating: 1,
  twitchProfileImage: 'https://static-cdn.jtvnw.net/jtv_user_pictures/0bd71b32-6417-471c-8196-d58df1a0105d-profile_image-300x300.jpg',
  twitchChannelName: 'obm1025',
};
const baseArgs = {
  index: 1,
  headerColumns: [
    {
      key: 'order', label: '순위', width: '5%', textAlign: 'center',
    },
    { key: 'profileImage', label: '', width: '15%' },
    { key: 'bjName', label: 'BJ이름', width: '50%' },
    { key: 'weeklyScoreGraph', label: '주간', width: '30%' },
  ].map((item) => ({ width: item.width })),
};

const trendsBase = [
  {
    createDate: '2021-05-13',
    title: '염보성 위례보안관',
  },
  {
    createDate: '2021-05-14',
    title: '염보성 하위^^',
  },
  {
    createDate: '2021-05-15',
    title: '염짱성 코드컵 합숙준비',
  },
  {
    createDate: '2021-05-18',
    title: '염보성 코드컵 전설의 300용사 모여라.....',
  },
  {
    createDate: '2021-05-19',
    title: '염보성 코드컵 한말씀드리겠습니다',
  },
  {
    createDate: '2021-05-19',
    title: '염보성 하,,,소신발언갈게요',
  },
  {
    createDate: '2021-05-21',
    title: '염보성 그녀만나러갑니다',
  },
];
export const Viewer = Template.bind({});
Viewer.args = {
  ...baseArgs,
  data: { ...baseData, viewer: 655 },
  currentScoreName: 'viewer',
  weeklyTrendsData: trendsBase.map((d) => ({ ...d, viewer: Math.random() * 200 })),
} as TopTenListItemProps;

export const Reaction = Template.bind({});
Reaction.args = {
  ...baseArgs,
  data: { ...baseData, smileScore: 6.55 },
  currentScoreName: 'smileScore',
  weeklyTrendsData: trendsBase.map((d) => ({ ...d, smileScore: Math.random() * 10 })),
} as TopTenListItemProps;
