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
  creatorData: {
    creatorId: 'creatorId',
    platform: 'afreeca',
    nickname: '크리에이터이름',
    twitchChannelName: null,
  },
};
