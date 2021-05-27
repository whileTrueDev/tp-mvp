import React, { useCallback } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { Props } from './MainTab';
import { useHorizontalTabItemStyle, useHorizontalTabsStyle } from '../../style/TopTenCard.style';

export default function CategoryTab(props: Props): JSX.Element {
  const { onTabChange, columns, ...rest } = props;
  const horizontalTabItemStyle = useHorizontalTabItemStyle();
  const horizontalTabsStyle = useHorizontalTabsStyle();
  const onChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    onTabChange(index);
  }, [onTabChange]);
  return (
    <Tabs
      {...rest}
      variant="scrollable"
      scrollButtons="auto"
      classes={horizontalTabsStyle}
      onChange={onChange}
    >
      {columns.map((col) => (
        <Tab
          key={col.categoryId}
          classes={horizontalTabItemStyle}
          disableRipple
          label={col.label}
        />
      ))}
    </Tabs>
  );
}
