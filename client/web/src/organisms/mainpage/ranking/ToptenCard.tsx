import {
  Grid, Tab, Tabs, Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import useAxios from 'axios-hooks';

const useStyles = makeStyles((theme: Theme) => createStyles({
  topTenWrapper: {
    backgroundColor: theme.palette.background.paper,
  },
  header: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));
export const useTabs = makeStyles((theme: Theme) => createStyles({
  indicator: {
    display: 'none',
  },
  scroller: {
    padding: theme.spacing(1),
  },
}));

// https://mui-treasury.com/styles/tabs/
export const useTabItem = makeStyles((theme: Theme) => {
  const defaultBgColor = theme.palette.background.paper;
  const defaultLabelColor = theme.palette.common.black;
  const rootHeight = 80;
  return createStyles({
    root: {
      textTransform: 'initial',
      backgroundColor: defaultBgColor,
      height: rootHeight,
      width: '80%',
      overflow: 'visible',
      position: 'relative',
      borderBottom: `1px solid ${theme.palette.divider}`,

      '&:after': {
        content: '" "',
        display: 'block',
        position: 'absolute',
        right: `-${rootHeight / 2}px`,
        top: 0,
        borderLeft: `${rootHeight / 2}px solid ${defaultBgColor}`,
        borderTop: `${rootHeight / 2}px solid transparent`,
        borderBottom: `${rootHeight / 2}px solid transparent`,
      },
    },
    selected: {
      '&$root': {
        filter: `drop-shadow(2px 2px 3px ${theme.palette.action.disabled}) drop-shadow(0px 0px 10px ${theme.palette.divider})`,
        zIndex: 1,
      },
      '& $wrapper': {
        color: theme.palette.primary.main,
      },
      '& $wrapper svg': {
        opacity: 1,
      },
    },
    wrapper: {
      color: defaultLabelColor,
      position: 'relative',
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: theme.spacing(2),
      '&>*': {
        // marginRight: theme.spacing(2),
      },
      '& svg': {
        opacity: 0,
        fill: theme.palette.primary.main,
        fontSize: theme.typography.h3.fontSize,
      },

    },
  });
});

function TopTenList({ data }: {data: any}): JSX.Element {
  return (
    <div>
      탑텐리스트
      {JSON.stringify(data, null, 2)}

    </div>
  );
}

const columns = [
  { name: 'admire', label: '감탄점수', icon: <PersonPinIcon /> },
  { name: 'smile', label: '웃음점수', icon: <PersonPinIcon /> },
  { name: 'frustrate', label: '답답함점수', icon: <PhoneIcon /> },
  { name: 'cuss', label: '욕점수', icon: <FavoriteIcon /> },
];
function ToptenCard(): JSX.Element {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const tabsStyles = useTabs();
  const tabItemStyles = useTabItem();

  const [{ data, loading, error }, refetch] = useAxios({
    url: '/rankings/top-ten',
    params: { column: columns[0].name },
  });

  const onChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setTabIndex(value);
    refetch({ params: { column: columns[value].name } });
  };

  if (error) {
    console.error(error);
  }
  return (
    <section className={classes.topTenWrapper}>
      <Grid container>
        <Grid item xs={3}>
          <header className={classes.header}>
            <Typography>반응별 랭킹</Typography>
            <Typography variant="h4">TOP 10</Typography>
          </header>
          <Tabs
            classes={tabsStyles}
            orientation="vertical"
            value={tabIndex}
            onChange={onChange}
          >
            {columns.map((c: typeof columns[0]) => (
              <Tab
                classes={tabItemStyles}
                key={c.name}
                icon={c.icon}
                label={c.label}
              />
            ))}
          </Tabs>
        </Grid>
        <Grid item xs={9}>
          {loading && <div>loading...</div>}
          <TopTenList data={data} />
        </Grid>
      </Grid>
    </section>
  );
}

export default ToptenCard;
