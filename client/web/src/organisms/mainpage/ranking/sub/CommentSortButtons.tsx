import React from 'react';
import classnames from 'classnames';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { useCreatorCommentListStyle } from '../style/CreatorComment.style';

export type CommentFilter = 'date' | 'recommend';
export const filters: CommentFilter[] = ['recommend', 'date'];

export interface CommentSortButtonsProps {
  clickedButtonIndex: number;
  handleRecommendFilter: () => void;
  handleDateFilter: () => void;
}

export default function CommentSortButtons(props: CommentSortButtonsProps): JSX.Element {
  const { handleRecommendFilter, handleDateFilter, clickedButtonIndex } = props;
  const listStyle = useCreatorCommentListStyle();
  return (
    <div className={listStyle.commentFilterContainer}>
      <Button
        startIcon={<CheckIcon />}
        className={classnames(listStyle.commentFilterButton, { selected: clickedButtonIndex === 0 })}
        onClick={handleRecommendFilter}
      >
        인기순
      </Button>
      <Button
        startIcon={<CheckIcon />}
        className={classnames(listStyle.commentFilterButton, { selected: clickedButtonIndex === 1 })}
        onClick={handleDateFilter}
      >
        최신순
      </Button>

    </div>
  );
}
