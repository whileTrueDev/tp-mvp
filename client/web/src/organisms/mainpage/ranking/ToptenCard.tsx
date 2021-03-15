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
}));

// https://mui-treasury.com/styles/tabs/
export const useTabItem = makeStyles((theme: Theme) => {
  const defaultBgColor = theme.palette.background.paper;
  const defaultLabelColor = theme.palette.common.black;
  const rootHeight = 80;
  // const beforeHeight = Math.sqrt((rootHeight ** 2) / 2);
  return createStyles({
    root: () => ({
      textTransform: 'initial',
      height: rootHeight,
      width: '100%',
      '&:before': {
        position: 'absolute',
        top: 65,
        left: 75,
        content: '" "',
        height: 30,
        width: 30,
        background: 'transparent',
        transformOrigin: '0% 0%',
        transform: 'rotate(45deg)',
        boxShadow: `0 0 0 150px ${defaultBgColor}`,
        zIndex: -1,
      },
    }),
    selected: {
      '&$root': {
        opacity: 0.99,
      },
      '& $wrapper': {
        color: theme.palette.primary.main,
      },
      '& $wrapper svg': {
        opacity: 0.99,
        fill: theme.palette.primary.main,
      },
    },
    wrapper: () => ({
      color: defaultLabelColor,
      flexDirection: 'row',
      '& .MuiSvgIcon-root': {
        opacity: 0,
      },
    }),
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
