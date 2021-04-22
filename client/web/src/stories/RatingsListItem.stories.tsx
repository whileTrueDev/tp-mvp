import React from 'react';
import { Story, Meta } from '@storybook/react';
import RatingsListItem, { RatingsListItemProps } from '../organisms/mainpage/ranking/sub/RatingsListItem';

export default {
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
