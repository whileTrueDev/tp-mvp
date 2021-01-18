import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

// targetContainer 내에 상단에 그래프 이름과 퍼센트 표시하는 컨테이너 생성 함수
export function createTitle(
  targetContainer: am4core.Container,
  type: string,
  text: {label: string, color: string, percent: number, },

): void {
  const textAlign = type === 'negative' ? 'left' : 'right';

  const container = targetContainer.createChild(am4core.Container);
  container.layout = 'vertical';
  container.toBack();
  container.paddingBottom = 30;
  container.paddingRight = am4core.percent(5);
  container.paddingLeft = am4core.percent(5);
  container.width = am4core.percent(50);

  const title = container.createChild(am4core.Label);
  title.text = text.label;
  title.align = textAlign;
  title.fontSize = 30;
  title.fill = am4core.color(text.color);

  const percentage = container.createChild(am4core.Label);
  percentage.text = `${text.percent}%`;
  percentage.align = textAlign;
  percentage.fontSize = 30;
  percentage.fill = am4core.color(text.color);
}

// targetChart 내에 y축 aixs생성하는 함수
export function createYCategoryAxis(
  targetChart: am4charts.XYChart,
  name: string,
  data: Record<string, any>[],
  category: string,
): am4charts.CategoryAxis<am4charts.AxisRenderer> {
  const yAxis = targetChart.yAxes.push(new am4charts.CategoryAxis());
  yAxis.data = data;
  yAxis.dataFields.category = category;
  yAxis.renderer.line.strokeOpacity = 1;
  yAxis.renderer.line.strokeWidth = 2;
  yAxis.renderer.line.stroke = am4core.color('#dedede');
  yAxis.renderer.inversed = true;
  yAxis.renderer.grid.template.disabled = true;
  yAxis.renderer.grid.template.location = 0;

  yAxis.renderer.cellStartLocation = 0.3;
  yAxis.renderer.cellEndLocation = 0.7;

  if (name === 'positive') {
    yAxis.renderer.labels.template.fill = am4core.color('#0011ff');
    yAxis.renderer.labels.template.dx = -50;
    yAxis.renderer.line.dx = -50;
  }
  if (name === 'negative') {
    yAxis.renderer.line.strokeOpacity = 0;
    yAxis.renderer.labels.template.dx = 50;
    yAxis.renderer.opposite = true;
  }
  yAxis.parent = targetChart.plotContainer;
  yAxis.align = 'center';

  return yAxis;
}

// x축과 그래프 생성하는 함수
export function createXAxisAndSeries(
  targetChart: am4charts.XYChart,
  option: {name: string, color: string, chartOption: Record<string, any>},
  data: Record<string, any>[],
  yAxis: am4charts.CategoryAxis<am4charts.AxisRenderer>,
): am4charts.ColumnSeries {
  const { name, color, chartOption } = option;
  const xAxis = targetChart.xAxes.push(new am4charts.ValueAxis());
  xAxis.data = data;
  xAxis.min = 0;
  xAxis.max = 100; // 입력되는 데이터의 최대값으로 변경해야함
  // xAxis.max = Math.max(...data.map((d) => d.value));
  xAxis.extraMax = 0.1;
  xAxis.renderer.grid.template.disabled = true;
  xAxis.renderer.labels.template.disabled = true;
  xAxis.renderer.inversed = name.includes('positive'); // 긍정단어그래프가 왼쪽
  if (name.includes('positive')) {
    xAxis.marginRight = chartOption.yAxisSpace;
  }
  if (name.includes('negative')) {
    xAxis.marginLeft = chartOption.yAxisSpace;
  }

  const series = targetChart.series.push(new am4charts.ColumnSeries());
  series.data = data;
  series.dataFields.valueX = 'value';
  series.dataFields.categoryY = 'text';
  series.name = name;
  series.xAxis = xAxis;
  series.yAxis = yAxis;
  series.columns.template.fill = am4core.color(color);
  series.columns.template.strokeOpacity = 0;
  series.columns.template.column.cornerRadius(
    chartOption.cornerRadius,
    chartOption.cornerRadius,
    chartOption.cornerRadius,
    chartOption.cornerRadius,
  );
  // 툴팁
  series.columns.template.tooltipText = '{categoryY}: {value}';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  series.tooltip!.pointerOrientation = 'down';

  const labelBullet = series.bullets.push(new am4charts.LabelBullet());
  labelBullet.label.horizontalCenter = name.includes('positive') ? 'left' : 'right';
  labelBullet.label.verticalCenter = 'middle';
  labelBullet.label.dx = name.includes('positive') ? chartOption.labelDx * (-1) : chartOption.labelDx;
  labelBullet.label.text = '{value}';
  labelBullet.locationX = 0;

  return series;
}
