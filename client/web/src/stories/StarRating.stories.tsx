import React from 'react';
import { Story, Meta } from '@storybook/react';
import StarRating, { StarRatingProps } from '../organisms/mainpage/ranking/sub/StarRating';

export default {
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
  editRatingHandler: (score: number|null) => (event: React.MouseEvent<HTMLElement>) => {
    if (!score) {
      alert('별점을 매겨주세요');
    } else {
      alert(`수정된 별점 : ${score * 2}`);
    }
  },
  cancelRatingHandler: () => {
    alert('별점 취소');
  },
};

export const NullScore = Template.bind({});
NullScore.args = {
  score: null,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  score: 6.4,
  readOnly: true,
};
