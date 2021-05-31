import React, { useCallback } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { Props } from './MainTab';
import { usePlatformTabsStyle, usePlatformTabItemStyle } from '../../style/TopTenCard.style';

export default function PlatformTab(props: Props): JSX.Element {
  const { onTabChange, columns, ...rest } = props;
  const platformTabsStyle = usePlatformTabsStyle();
  const platformTabItemStyle = usePlatformTabItemStyle();
  const onChange = useCallback((event: React.ChangeEvent<unknown>, index: number) => {
    onTabChange(index);
  }, [onTabChange]);
  return (
    <Tabs
      {...rest}
      classes={platformTabsStyle}
      onChange={onChange}
    >
      {columns.map((col) => (
        <Tab classes={platformTabItemStyle} key={col.platform} label={col.label} />
      ))}
    </Tabs>
  );
}
