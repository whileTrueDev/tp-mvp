import HighchartsReact from 'highcharts-react-official';
import React, { useCallback, useRef } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Button, Grid, Tooltip } from '@material-ui/core';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import useScoresHistoryChartOptions,
{ highCharts } from '../../../../utils/hooks/useScoresHistoryChartOptions';
import CenterLoading from '../../../../atoms/Loading/CenterLoading';
import { buttons, ScoresHistoryControlButton, useScoresHistoryButton } from '../../../../store/scoresHistoryButton';

export default function ScoresHistorySection({ creatorId }: {creatorId: string}): JSX.Element {
  const theme = useTheme();
  const { isMobile: isDownSm, isDownXs } = useMediaSize();
  const { selectedButton, changeButton } = useScoresHistoryButton();
  const {
    chartOptions,
    loading,
  } = useScoresHistoryChartOptions({ creatorId });
  const chartRef = useRef<{
    chart: Highcharts.Chart,
    container: React.RefObject<HTMLDivElement>
  }>(null);

  const getButtonStyle = useCallback((button: ScoresHistoryControlButton) => ({
    backgroundColor: selectedButton.key === button.key
      ? theme.palette.primary.main : 'transparent',
    color: selectedButton.key === button.key
      ? theme.palette.primary.contrastText : theme.palette.text.primary,
  }), [selectedButton.key, theme.palette.primary.contrastText, theme.palette.primary.main, theme.palette.text.primary]);

  const renderButton = useCallback((button: ScoresHistoryControlButton) => {
    const buttonStyle = getButtonStyle(button);
    // xs이하 사이즈일때 - 아이콘만 표시, 툴팁 추가
    if (isDownXs) {
      return (
        <Tooltip key={button.key} title={button.label} arrow>
          <Button
            onClick={() => changeButton(button)}
            variant="outlined"
            size="small"
            style={{
              ...buttonStyle,
              width: 48,
            }}
          >
            {button.icon}
          </Button>
        </Tooltip>
      );
    }
    return (
      <Button
        key={button.key}
        onClick={() => changeButton(button)}
        startIcon={button.icon}
        variant="outlined"
        style={{
          ...buttonStyle,
          width: 'auto',
        }}
      >
        {button.label}
      </Button>
    );
  }, [changeButton, getButtonStyle, isDownXs]);

  return (
    <Grid container style={{ backgroundColor: theme.palette.background.paper }}>
      <Grid
        item
        xs={12}
        md={2}
        container
        direction={isDownSm ? 'row' : 'column'}
        justify="space-around"
        wrap="nowrap"
        style={{ padding: 8 }}
      >
        { buttons.map(renderButton) }
      </Grid>
      <Grid
        item
        xs={12}
        md={10}
        style={{ position: 'relative' }}
      >
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
