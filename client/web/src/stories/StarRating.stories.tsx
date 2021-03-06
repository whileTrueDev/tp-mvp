import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Story, Meta } from '@storybook/react';
import StarRating, { StarRatingProps } from '../organisms/mainpage/ranking/creatorInfo/StarRating';

export default {
  decorators: [
    (story) => (<MemoryRouter>{story()}</MemoryRouter>),
  ],
  title: 'organisms/StarRating',
  component: StarRating,
  argTypes: {
    score: {
      control: {
        type: 'range', min: '0', max: '10', step: '0.1',
      },
    },
  },
} as Meta;

const Template: Story<StarRatingProps> = (args) => <StarRating {...args} />;

export const Default = Template.bind({});
Default.args = {
  score: 3,
  createRatingHandler: (score: number|null) => {
    if (!score) {
      alert('별점을 매겨주세요');
    } else {
      alert(`수정된 별점 : ${score}`);
    }
  },
  cancelRatingHandler: () => {
    alert('별점 취소');
  },
};

export const NullScore = Template.bind({});
NullScore.args = {
  score: undefined,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  score: 6.4,
  readOnly: true,
};
