import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { EquityPoint } from '@/types';
import { formatCurrency, formatDate } from '@/data/mockData';
import { useTheme } from '@/theme/ThemeProvider';

interface EquityChartProps {
  data: EquityPoint[];
  height?: number;
}

export function EquityChart({ data, height = 280 }: EquityChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const {
    points,
    width,
    pathD,
    areaD,
    baselineY,
    startEquity,
    currentEquity,
    yLabels,
    xLabels,
    chartLeft,
    chartRight,
    chartTop,
    chartBottom,
    isEmpty,
    isSinglePoint,
  } = useMemo(() => {
    const w = Math.max(containerWidth, 320);
    const h = height;
    const padTop = 24;
    const padBot = 32;
    const padLeft = 56;
    const padRight = 20;

    const cL = padLeft;
    const cR = w - padRight;
    const cT = padTop;
    const cB = h - padBot;

    const empty = data.length === 0;
    const single = data.length === 1;

    if (empty) {
      return {
        points: [] as { x: number; y: number; data: EquityPoint }[],
        width: w,
        pathD: '',
        areaD: '',
        baselineY: cT + (cB - cT) / 2,
        startEquity: 0,
        currentEquity: 0,
        yLabels: [] as { value: number; y: number }[],
        xLabels: [] as { label: string; x: number }[],
        chartLeft: cL,
        chartRight: cR,
        chartTop: cT,
        chartBottom: cB,
        isEmpty: true,
        isSinglePoint: false,
      };
    }

    const equities = data.map((d) => d.equity);
    const rawMin = Math.min(...equities);
    const rawMax = Math.max(...equities);
    const range = rawMax - rawMin || 1;
    const min = rawMin - range * 0.12;
    const max = rawMax + range * 0.12;
    const scaledRange = max - min;

    const pts = data.map((d, i) => {
      const x = single ? cL + (cR - cL) / 2 : cL + (i / (data.length - 1)) * (cR - cL);
      const y = cT + (1 - (d.equity - min) / scaledRange) * (cB - cT);
      return { x, y, data: d };
    });

    // Straight line segments — preserve actual rises and drops
    let path = '';
    let areaPath = '';
    pts.forEach((p, i) => {
      if (i === 0) {
        path += `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        areaPath += `M ${p.x.toFixed(2)} ${cB} L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      } else {
        path += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        areaPath += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      }
    });
    areaPath += ` L ${pts[pts.length - 1].x.toFixed(2)} ${cB} L ${pts[0].x.toFixed(2)} ${cB} Z`;

    const start = data[0].equity;
    const current = data[data.length - 1].equity;
    const baseY = cT + (1 - (start - min) / scaledRange) * (cB - cT);

    // Y-axis labels — 5 points
    const labels: { value: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const ratio = i / 4;
      const val = max - ratio * scaledRange;
      const y = cT + ratio * (cB - cT);
      labels.push({ value: Math.round(val), y });
    }

    // X-axis date labels — ~5 evenly spaced
    const xLabs: { label: string; x: number }[] = [];
    const xCount = Math.min(5, data.length);
    for (let i = 0; i < xCount; i++) {
      const idx = single ? 0 : Math.round((i / (xCount - 1)) * (data.length - 1));
      xLabs.push({
        label: formatDate(data[idx].date, { month: 'short', day: 'numeric' }),
        x: pts[idx].x,
      });
    }

    return {
      points: pts,
      width: w,
      pathD: path,
      areaD: areaPath,
      baselineY: baseY,
      startEquity: start,
      currentEquity: current,
      yLabels: labels,
      xLabels: xLabs,
      chartLeft: cL,
      chartRight: cR,
      chartTop: cT,
      chartBottom: cB,
      isEmpty: false,
      isSinglePoint: single,
    };
  }, [data, height, containerWidth]);

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    let closest = 0;
    let closestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - x);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setHoverIdx(closest);
  };

  const hover = hoverIdx !== null && points.length > 0 ? points[hoverIdx] : null;
  const isPositive = currentEquity >= startEquity;

  const lineColor = isPositive
    ? (isDark ? 'rgb(52 211 153)' : 'rgb(16 185 129)')
    : (isDark ? 'rgb(248 113 113)' : 'rgb(220 38 38)');
  const glowColor = isPositive
    ? (isDark ? 'rgba(52, 211, 153, 0.25)' : 'rgba(16, 185, 129, 0.18)')
    : (isDark ? 'rgba(248, 113, 113, 0.25)' : 'rgba(220, 38, 38, 0.18)');
  const fillTop = isPositive
    ? (isDark ? 'rgba(52, 211, 153, 0.10)' : 'rgba(16, 185, 129, 0.06)')
    : (isDark ? 'rgba(248, 113, 113, 0.10)' : 'rgba(220, 38, 38, 0.06)');
  const fillBottom = isPositive
    ? (isDark ? 'rgba(52, 211, 153, 0)' : 'rgba(16, 185, 129, 0)')
    : (isDark ? 'rgba(248, 113, 113, 0)' : 'rgba(220, 38, 38, 0)');
  const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const baselineColor = isDark ? 'rgba(205,173,112,0.25)' : 'rgba(99,75,38,0.22)';
  const labelColor = isDark ? 'rgba(160,166,180,0.55)' : 'rgba(140,145,158,0.65)';
  const crosshairColor = isDark ? 'rgba(205,173,112,0.4)' : 'rgba(99,75,38,0.35)';

  const pathLength = points.length * 120;

  if (isEmpty) {
    return (
      <div ref={containerRef} className="relative w-full flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <p className="text-sm text-text-tertiary">No equity data yet</p>
          <p className="text-xs text-text-tertiary mt-1">Your curve will appear once you log trades.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="equity-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillTop} />
            <stop offset="100%" stopColor={fillBottom} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yLabels.map((label, i) => (
          <line
            key={`grid-${i}`}
            x1={chartLeft}
            x2={chartRight}
            y1={label.y}
            y2={label.y}
            stroke={gridColor}
            strokeWidth="1"
            strokeDasharray={i === 0 || i === 4 ? '0' : '3 6'}
          />
        ))}

        {/* Y-axis labels */}
        {yLabels.map((label, i) => (
          <text
            key={`ylabel-${i}`}
            x={chartLeft - 8}
            y={label.y + 3}
            textAnchor="end"
            fill={labelColor}
            fontSize="11"
            fontFamily="Inter, sans-serif"
          >
            ${label.value >= 1000 ? `${(label.value / 1000).toFixed(1)}K` : label.value}
          </text>
        ))}

        {/* X-axis date labels */}
        {xLabels.map((xl, i) => (
          <text
            key={`xlabel-${i}`}
            x={xl.x}
            y={chartBottom + 18}
            textAnchor="middle"
            fill={labelColor}
            fontSize="10"
            fontFamily="Inter, sans-serif"
          >
            {xl.label}
          </text>
        ))}

        {/* Starting balance baseline */}
        <line
          x1={chartLeft}
          x2={chartRight}
          y1={baselineY}
          y2={baselineY}
          stroke={baselineColor}
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <text
          x={chartLeft + 4}
          y={baselineY - 5}
          textAnchor="start"
          fill={labelColor}
          fontSize="10"
          fontFamily="Inter, sans-serif"
        >
          Start ${startEquity.toLocaleString()}
        </text>

        {/* Area fill — subordinate to line */}
        {!isSinglePoint && <path d={areaD} fill="url(#equity-fill)" />}

        {/* Glow layer behind the line */}
        {!isSinglePoint && (
          <path
            d={pathD}
            fill="none"
            stroke={glowColor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
              animation: 'draw-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          />
        )}

        {/* Main equity line — the hero */}
        {!isSinglePoint && (
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: pathLength,
              animation: 'draw-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}
          />
        )}

        {/* Endpoint indicator with breathing pulse */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="10"
          fill={lineColor}
          opacity="0.15"
          className="animate-endpoint-breathe"
        />
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={lineColor}
          stroke={isDark ? 'rgb(18 21 29)' : 'rgb(255 255 255)'}
          strokeWidth="2"
        />

        {/* Hover crosshair + dot */}
        {hover && (
          <g>
            <line
              x1={hover.x}
              x2={hover.x}
              y1={chartTop}
              y2={chartBottom}
              stroke={crosshairColor}
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <circle cx={hover.x} cy={hover.y} r="7" fill={lineColor} opacity="0.15" />
            <circle cx={hover.x} cy={hover.y} r="4.5" fill={lineColor} stroke={isDark ? 'rgb(18 21 29)' : 'rgb(255 255 255)'} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Hover tooltip */}
      {hover && (
        <div
          className="absolute pointer-events-none z-10 vault-elevated rounded-lg shadow-elevated dark:shadow-dark-elevated px-3 py-2 animate-fade-in"
          style={{
            top: '6px',
            left: `${(hover.x / width) * 100}%`,
            transform: `translateX(${hover.x / width > 0.82 ? '-112%' : '12%'})`,
          }}
        >
          <div className="text-[0.6875rem] text-text-tertiary uppercase tracking-wider mb-0.5">
            {formatDate(hover.data.date, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-sm font-semibold text-text-primary tabular-nums">
            {formatCurrency(hover.data.equity)}
          </div>
          {!isSinglePoint && (
            <div className={`text-xs font-medium mt-0.5 ${hover.data.equity >= startEquity ? 'text-positive' : 'text-negative'}`}>
              {hover.data.equity >= startEquity ? '+' : ''}
              {formatCurrency(hover.data.equity - startEquity)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
