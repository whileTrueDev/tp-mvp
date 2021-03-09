import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';

import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import HCmore from 'highcharts/highcharts-more'; // polar area chart 사용 위해 필요
import CenterLoading from '../../../atoms/Loading/CenterLoading';

exporting(Highcharts);

HCmore(Highcharts);// polar area chart 사용 위해 필요
const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {},
}));

function ViewerComparisonPolarAreaCard(): JSX.Element {
  const classes = useStyles();
  const [{ data, loading, error }] = useAxios('/rankings/daily-total-viewers');
  const interval = 360 / 10;
  const startAngle = 0;

  // Multiple polar charts https://www.highcharts.com/forum/viewtopic.php?t=42296#p148602
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: { type: 'column', polar: true },
    // pane: [{ // 타입정의가 배열 못받게 되어있음...
    //   center: ['25%', '30%'],
    //   size: 200,
    // }, {
    //   center: ['75%', '30%'],
    //   size: 300,
    // }],
    yAxis: { labels: { enabled: false } },
    xAxis: {
      tickInterval: interval,
      min: 0,
      max: 360,
      labels: {
        enabled: false,
      },
    },
    plotOptions: {
      series: {
        pointStart: startAngle,
        pointInterval: interval,
      },
      column: {
        pointPadding: 0,
        groupPadding: 0,
      },
    },
    series: [{
      type: 'column',
      name: 'Column',
      data: [8, 7, 6, 5, 4, 3, 2, 1],
      pointPlacement: 'between',
    }],
  });

  useEffect(() => {
    if (!data) return;
    console.log(data);
  }, [data]);

  if (error) {
    console.error(error);
  }
  return (
    <section className={classes.polarAreaContainer}>
      비교차트
      {JSON.stringify(data, null, 2)}
      {loading && <CenterLoading />}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </section>
  );
}

export default ViewerComparisonPolarAreaCard;
