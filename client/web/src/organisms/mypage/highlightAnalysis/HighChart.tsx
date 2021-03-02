import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Chart(): JSX.Element {
  const [hoverData, setHoverData] = useState(null);
  const [chartOptions, setChartOptions] = useState({
    xAxis: {
      categories: ['A', 'B', 'C'],
    },
    series: [
      { data: [1, 2, 3] },
    ],
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver(e: any) {
              setHoverData(e.target.category);
            },
          },
        },
      },
    },
  });

  const updateSeries = () => {
    setChartOptions({
      ...chartOptions,
      series: [
        { data: [Math.random() * 5, 2, 1] },
      ],
    });
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
      <h3>{hoverData}</h3>
      <button onClick={updateSeries}>Update Series</button>
    </div>
  );
}
