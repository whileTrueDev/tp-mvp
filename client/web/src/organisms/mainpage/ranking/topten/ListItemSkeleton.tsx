import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import classnames from 'classnames';
import { Hidden } from '@material-ui/core';
import { useTopTenList } from '../style/TopTenList.style';
import useMediaSize from '../../../../utils/hooks/useMediaSize';

function ListItemSkeleton(): JSX.Element {
  const classes = useTopTenList();
  const theme = useTheme();
  const { isMobile } = useMediaSize();
  return (
    <div className={classnames(classes.listItem)}>
      <div className={classnames(classes.background, classes.placeholder)} style={{ width: '70%' }}>
        <div style={{ width: '10%' }}>
          <Skeleton variant="rect" width={isMobile ? '50%' : '100%'} height={theme.spacing(4)} />
        </div>
        <div style={{ width: '20%' }}>
          <Skeleton variant="circle" width={theme.spacing(isMobile ? 6 : 10)} height={theme.spacing(isMobile ? 6 : 10)} />
        </div>
        <div style={{ width: '70%' }}>
          <Skeleton width="90%" height={theme.spacing(4)} />
          <Skeleton width="90%" />
          <Skeleton width="90%" />
        </div>
      </div>

      <Hidden smDown>
        <div style={{ width: '30%' }}>
          <Skeleton variant="rect" width="90%" height={theme.spacing(10)} />
        </div>
      </Hidden>

    </div>
  );
}

export default ListItemSkeleton;
