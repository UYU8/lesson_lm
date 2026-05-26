import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface LineChartProps {
  xAxisData: string[];
  seriesData: Array<{
    name: string;
    data: number[];
    color?: string;
  }>;
  title?: string;
  height?: number;
  yAxisName?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  xAxisData,
  seriesData,
  title,
  height = 300,
  yAxisName = '金额（¥）',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsOption = {
      title: title ? { text: title, left: 'center' } : undefined,
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          if (Array.isArray(params)) {
            let result = params[0].axisValue + '<br/>';
            params.forEach((param: any) => {
              result += `${param.marker} ${param.seriesName}: ¥${param.value}<br/>`;
            });
            return result;
          }
          return '';
        },
      },
      legend: {
        data: seriesData.map(s => s.name),
        top: 30,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 60,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        name: yAxisName,
      },
      series: seriesData.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: true,
        itemStyle: s.color ? { color: s.color } : undefined,
        areaStyle: {
          opacity: 0.2,
        },
      })),
    };

    chartInstance.current.setOption(option);

    // 处理窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [xAxisData, seriesData, title, yAxisName]);

  return <div ref={chartRef} style={{ width: '100%', height: `${height}px` }} />;
};

export default LineChart;
