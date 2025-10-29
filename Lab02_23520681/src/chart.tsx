/** @jsx createElement */
import { createElement, ComponentProps } from './jsx-runtime';
import { DataPoint } from './data-service';

interface ChartProps extends ComponentProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
  width?: number;
  height?: number;
  title?: string;
}

export const Chart = (props: ChartProps) => {
  const { data, type, width = 600, height = 400, title } = props;

  let canvasRef: HTMLCanvasElement | null = null;

  const setRef = (element: HTMLCanvasElement) => {
    canvasRef = element;
    if (canvasRef) {
      setTimeout(drawChart, 0);
    }
  };

  const drawChart = () => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    switch (type) {
      case 'bar':
        drawBarChart(ctx, data, width, height);
        break;
      case 'line':
        drawLineChart(ctx, data, width, height);
        break;
      case 'pie':
        drawPieChart(ctx, data, width, height);
        break;
    }
  };

  const drawBarChart = (
      ctx: CanvasRenderingContext2D,
      data: DataPoint[],
      width: number,
      height: number
  ) => {
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length - 20;
    const maxValue = Math.max(...data.map(d => d.value), 1);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / data.length) + 10;
      const y = height - padding - barHeight;

      ctx.fillStyle = point.color || '#667eea';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(point.value).toString(), x + barWidth / 2, y - 8);

      ctx.font = '12px sans-serif';
      ctx.fillText(point.label, x + barWidth / 2, height - padding + 25);
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = height - padding - (chartHeight / 5) * i;
      ctx.fillText(Math.round(value).toString(), padding - 15, y + 4);
    }
  };

  const drawLineChart = (
      ctx: CanvasRenderingContext2D,
      data: DataPoint[],
      width: number,
      height: number
  ) => {
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data.map(d => d.value), 1);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding - (point.value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = height - padding - (point.value / maxValue) * chartHeight;

      ctx.fillStyle = point.color || '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(point.value).toString(), x, y - 12);

      ctx.font = '12px sans-serif';
      ctx.fillText(point.label, x, height - padding + 25);
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * i;
      const y = height - padding - (chartHeight / 5) * i;
      ctx.fillText(Math.round(value).toString(), padding - 15, y + 4);
    }
  };

  const drawPieChart = (
      ctx: CanvasRenderingContext2D,
      data: DataPoint[],
      width: number,
      height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;
    const total = data.reduce((sum, point) => sum + point.value, 0);

    let currentAngle = -Math.PI / 2;

    data.forEach((point) => {
      const sliceAngle = (point.value / total) * Math.PI * 2;

      ctx.fillStyle = point.color || '#667eea';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.65);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.65);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, labelX, labelY);

      const percentage = ((point.value / total) * 100).toFixed(1);
      ctx.font = '13px sans-serif';
      ctx.fillText(`${percentage}%`, labelX, labelY + 18);

      currentAngle += sliceAngle;
    });

    const legendX = 30;
    let legendY = height - data.length * 30 - 30;

    data.forEach((point) => {
      ctx.fillStyle = point.color || '#667eea';
      ctx.fillRect(legendX, legendY, 18, 18);

      ctx.fillStyle = '#1f2937';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${point.label}: ${Math.round(point.value)}`, legendX + 25, legendY + 14);

      legendY += 30;
    });
  };

  return (
      <div className="chart-container">
        {title && <h3>{title}</h3>}
        <canvas
            ref={setRef}
            width={width}
            height={height}
        />
      </div>
  );
};