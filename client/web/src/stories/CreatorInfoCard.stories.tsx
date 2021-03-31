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
  creatorId: 'creatorId',
  platform: 'afreeca',
  afreecaProfileImage: 'https://profile.img.afreecatv.com/LOGO/10/1004suna/1004suna.jpg',
  twitchProfileImage: null,
  nickname: '크리에이터이름',
  twitchChannelName: null,
  averageRating: 3.3,
  ratingCount: 122,
  scores: {
    admire: 4,
    cuss: 3,
    frustrate: 5,
    smile: 10,
  },
};
