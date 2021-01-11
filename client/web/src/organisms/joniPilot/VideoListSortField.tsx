import React, { memo, useMemo } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useWhyDidYouUpdate from './useWhyDidYouUpdate';

export interface VideoListSortFieldPropsType{
  field? : string;
  handleChange? : (event: React.ChangeEvent<{ value: any;}>) => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    textAlign: 'right',
  },
  select: {
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    fontSize: '21px',
  },
}));

export type FieldType = 'date'|'views'|'likes'|'comments';
const menuItemList = [
  { value: 'date', text: '업로드 날짜' },
  { value: 'likes', text: '좋아요 수' },
  { value: 'comments', text: '댓글 수' },
  { value: 'views', text: '조회 수' },
];

export default memo((props: VideoListSortFieldPropsType): JSX.Element => {
  const classes = useStyles();
  const { field, handleChange } = props;
  useWhyDidYouUpdate('sort field', props);

  const menuItems = useMemo(() => menuItemList.map((item) => (
    <MenuItem
      value={item.value}
      key={item.value}
    >
      {item.text}
    </MenuItem>
  )), []);
  return (
    <div className={classes.container}>

      <Select
        className={classes.select}
        variant="outlined"
        labelId="video-sort-field-select-label"
        id="video-sort-field-select"
        value={field}
        onChange={handleChange}
      >
        {menuItems}
      </Select>
    </div>
  );
});