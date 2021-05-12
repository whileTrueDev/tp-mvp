import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import RatingsListItem, { RatingsListItemProps } from '../organisms/mainpage/ranking/sub/RatingsListItem';

export default {
  decorators: [
    (story) => <MemoryRouter>{story()}</MemoryRouter>,
    (DefaultStory) => <div style={{ width: '560px' }}><DefaultStory /></div>,
  ],
  title: 'organisms/RatingsListItem',
  component: RatingsListItem,
} as Meta;

const Template: Story<RatingsListItemProps> = (args) => <RatingsListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  creatorId: 'bht0205',
  averageRating: 3,
  nickname: 'AZ.형태형',
  rankChange: 1,
  logo: 'https://profile.img.afreecatv.com/LOGO/bh/bht0205/bht0205.jpg',
  platform: 'afreeca',
};

export const LongName = Template.bind({});
LongName.args = {
  ...Default.args,
  nickname: '이름이 아주 긴 크리에이터이름이 아주 긴 크리에이터이름이 아주 긴 크리에이터',
};
