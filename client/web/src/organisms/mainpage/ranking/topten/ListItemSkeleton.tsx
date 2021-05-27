import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import classnames from 'classnames';
import { Hidden } from '@material-ui/core';
import { useTopTenList } from '../style/TopTenList.style';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

interface Props{
  headerColumns: {width: string}[]
}
function ListItemSkeleton(props: Props): JSX.Element {
  const classes = useTopTenList();
  const theme = useTheme();
  const { headerColumns } = props;
  const { isMobile } = useMediaSize();

  return (
    <div className={classnames(classes.listItem, classes.placeholder)}>
      <div style={{ width: isMobile ? '10%' : headerColumns[0].width }}>
        <Skeleton variant="rect" width={isMobile ? '50%' : '100%'} height={theme.spacing(4)} />
      </div>
      <div style={{ width: isMobile ? '15%' : headerColumns[1].width }}>
        <Skeleton variant="circle" width={theme.spacing(isMobile ? 6 : 10)} height={theme.spacing(isMobile ? 6 : 10)} />
      </div>
      <div style={{ width: isMobile ? '75%' : headerColumns[2].width }}>
        <Skeleton width="90%" height={theme.spacing(4)} />
        <Skeleton width="90%" />
        <Skeleton width="90%" />
      </div>
      <Hidden smDown>
        <div style={{ width: headerColumns[3].width }}>
          <Skeleton variant="rect" width="90%" height={theme.spacing(10)} />
        </div>
      </Hidden>

    </div>
  );
}

export default ListItemSkeleton;
