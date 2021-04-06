import React from 'react';
import { Story, Meta } from '@storybook/react';
import CreatorInfoCard, { CreatorInfoCardProps } from '../organisms/mainpage/ranking/sub/CreatorInfoCard';

export default {
  title: 'organisms/CreatorInfoCard',
  component: CreatorInfoCard,
} as Meta;

const Template: Story<CreatorInfoCardProps> = (args) => <CreatorInfoCard {...args} />;

export const Default = Template.bind({});
Default.decorators = [
  // eslint-disable-next-line no-shadow
  (Story) => <div style={{ maxWidth: '700px', border: '1px solid red' }}><Story /></div>,
];
Default.args = {
  scores: {
    admire: 4.8437222635580435,
    smile: 5.983833379215664,
    frustrate: 6.499277750651042,
    cuss: 4.89383327960968,
  },
  userRating: 8,
  ratings: {
    average: 8,
    count: 1,
  },
  info: {
    platform: 'afreeca',
    creatorId: 'bht0205',
    logo: 'https://profile.img.afreecatv.com/LOGO/bh/bht0205/bht0205.jpg',
    nickname: 'AZ.형태형',
  },
};
