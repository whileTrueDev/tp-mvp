import HighchartsReact from 'highcharts-react-official';
import React, { useRef } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import useScoresHistoryChartOptions,
{ highCharts, buttons } from '../../../../utils/hooks/useScoresHistoryChartOptions';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';

export default function ScoresHistorySection({ creatorId }: {creatorId: string}): JSX.Element {
  const theme = useTheme();
  const { isMobile: isDownSm, isDownXs } = useMediaSize();
  const {
    setSelectedButton,
    selectedButton,
    chartOptions,
    loading,
  } = useScoresHistoryChartOptions({ creatorId });
    // 차트컨테이너 ref
  const chartRef = useRef<{chart: Highcharts.Chart, container: React.RefObject<HTMLDivElement>}>(null);

  return (
    <Grid container style={{ backgroundColor: theme.palette.background.paper }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={2}
        container
        direction={isDownSm ? 'row' : 'column'}
        justify="space-around"
        wrap="nowrap"
        style={{ padding: 8 }}
      >
        {
          buttons.map((button) => (
            <Button
              key={button.key}
              onClick={() => setSelectedButton(button)}
              startIcon={isDownXs ? undefined : button.icon}
              variant="outlined"
              size={isDownSm ? 'small' : 'medium'}
              style={{
                backgroundColor: selectedButton.key === button.key
                  ? theme.palette.primary.main : 'transparent',
                color: selectedButton.key === button.key
                  ? theme.palette.primary.contrastText : theme.palette.text.primary,
                width: isDownXs ? 48 : 'auto',
              }}
            >
              {isDownXs ? button.icon : button.label}
            </Button>
          ))
        }
      </Grid>
      <Grid item xs={12} sm={12} md={10} style={{ position: 'relative' }}>
        <HighchartsReact
          ref={chartRef}
          highcharts={highCharts}
          options={chartOptions}
        />
        {loading && <CenterLoading />}
      </Grid>
    </Grid>
  );
}
