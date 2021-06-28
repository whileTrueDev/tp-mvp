import React from 'react';
import { Story, Meta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { CreatorsBox, CreatorsBoxProps, CreatorAvatarProps } from '../organisms/mypage/userInfo/MyRatings';

export default {
  decorators: [
    (story) => (<MemoryRouter>{story()}</MemoryRouter>),
  ],
  title: 'organisms/MyRatingCreators',
  component: CreatorsBox,
} as Meta;

const Template: Story<CreatorsBoxProps> = (args) => <CreatorsBox {...args} />;

const fakeCreators = new Array(12).fill(0).map((v, i) => ({
  rating: Math.floor(Math.random() * 10),
  platform: i % 2 === 0 ? 'afreeca' : 'twitch',
  creatorId: `phonics1_${i}`,
  creatorDisplayName: `김민교._${i}`,
  creatorProfileImage: i % 4 !== 0 ? 'https://static-cdn.jtvnw.net/jtv_user_pictures/9433d62c-2c38-44fe-9e8f-6875a23aaac4-profile_image-300x300.png' : undefined,
}));

export const Default = Template.bind({});
Default.args = {
  loading: false,
  creators: fakeCreators as CreatorAvatarProps[],
  prevButtonHandler: () => {
    // console.log('move to prev');
  },
  nextButtonHandler: () => {
    // console.log('move to next');
  },
  prevButtonDisabled: false,
  nextButtonDisabled: true,
};
