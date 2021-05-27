import React, { useCallback } from 'react';
import { Tab, Tabs, TabsProps } from '@material-ui/core';
import { useTabItem, useTabs } from '../../style/TopTenCard.style';

export type Props = {
  columns: any[],
  onTabChange: (index: number) => void,
} & TabsProps

export default function MainTab(props: Props): JSX.Element {
  const {
    onTabChange, columns, ...rest
  } = props;
  const verticalTabsStyles = useTabs();
  const verticalTabItemStyles = useTabItem();
  const onChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    onTabChange(index);
  }, [onTabChange]);

  return (
    <Tabs
      {...rest}
      style={{ overflow: 'visible' }} // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
      classes={verticalTabsStyles}
      orientation="vertical"
      onChange={onChange}
    >
      {columns && columns.map((c) => (
        <Tab
          disableRipple
          classes={verticalTabItemStyles}
          key={c.column}
          icon={c.icon}
          label={c.label}
          className={c.className}
        />
      ))}
    </Tabs>
  );
}
