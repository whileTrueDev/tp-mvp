import React, { useCallback } from 'react';
import { Tab, Tabs, TabsProps } from '@material-ui/core';
import { useTabItem, useTabs } from '../../style/TopTenCard.style';
import useRankingState from '../../../../../utils/hooks/useRankingState';

export type Props = {
  columns: any[],
  onTabChange?: (index: number) => void,
} & TabsProps

export default function MainTab(props: Props): JSX.Element {
  const {
    columns, onTabChange, ...rest
  } = props;
  const verticalTabsStyles = useTabs();
  const verticalTabItemStyles = useTabItem();
  const { mainTabIndex, changeMain } = useRankingState();
  const onChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    changeMain(index);
  }, [changeMain]);

  return (
    <Tabs
      {...rest}
      value={mainTabIndex}
      style={{ overflow: 'visible' }} // mui-tabs기본스타일 덮어쓰기위해 인라인스타일 적용
      classes={verticalTabsStyles}
      orientation="vertical"
      onChange={onChange}
    >
      {columns.map((c) => (
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
