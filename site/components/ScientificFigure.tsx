import { assetPath } from '@/lib/site';
import type { Locale } from '@/lib/i18n';
import { parseScientificText, scientificTextPlainText } from '@/lib/scientific-text';
import type { FigureCurve, FigureIndexEntry } from '@/lib/types';
import { ScientificText } from './ScientificText';

const WIDTH = 760;
const HEIGHT = 400;
const LEFT = 72;
const RIGHT = 716;
const TOP = 52;
const BOTTOM = 330;

const mapX = (value: number) => LEFT + (Math.max(0, Math.min(100, value)) / 100) * (RIGHT - LEFT);
const mapY = (value: number) => BOTTOM - (Math.max(0, Math.min(100, value)) / 100) * (BOTTOM - TOP);
const curvePath = (curve: FigureCurve) => curve.points.map(([x, y], index) => `${index ? 'L' : 'M'} ${mapX(x)} ${mapY(y)}`).join(' ');

type SvgLabelAnchor = 'start' | 'middle' | 'end';

function SvgLabel({ x, y, text, className, anchor = 'middle', width = 180 }: { x: number; y: number; text: string; className?: string; anchor?: SvgLabelAnchor; width?: number }) {
  const lines = text.split('\n');
  const hasFormula = parseScientificText(text).some((segment) => segment.kind === 'math');
  if (hasFormula) {
    const height = Math.max(24, lines.length * 19 + 4);
    const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - (width / 2);
    return (
      <foreignObject className={className} x={left} y={y - (height / 2)} width={width} height={height}>
        <div className={`svg-scientific-label svg-label-${anchor}`}>
          {lines.map((line, index) => <div key={`${line}-${index}`}><ScientificText text={line} /></div>)}
        </div>
      </foreignObject>
    );
  }
  return (
    <text className={className} x={x} y={y - ((lines.length - 1) * 8)} textAnchor={anchor}>
      {lines.map((line, index) => <tspan x={x} dy={index ? 17 : 0} key={`${line}-${index}`}>{line}</tspan>)}
    </text>
  );
}

function Axes({ xLabel, yLabel }: { xLabel: string; yLabel: string }) {
  return (
    <g className="scientific-axes">
      <line x1={LEFT} x2={RIGHT} y1={BOTTOM} y2={BOTTOM} />
      <line x1={LEFT} x2={LEFT} y1={BOTTOM} y2={TOP} />
      <SvgLabel x={(LEFT + RIGHT) / 2} y={382} text={xLabel} width={320} />
      <g transform={`translate(21 ${(TOP + BOTTOM) / 2}) rotate(-90)`}><SvgLabel x={0} y={0} text={yLabel} width={250} /></g>
    </g>
  );
}

function Curves({ curves, prefix }: { curves: FigureCurve[]; prefix: string }) {
  return (
    <>
      {curves.map((curve, index) => (
        <g key={`${prefix}-${curve.label}`}>
          <path className={`scientific-curve curve-${index % 4}`} d={curvePath(curve)} strokeDasharray={curve.dashed ? '10 7' : undefined} />
          {curve.markers && curve.points.map(([x, y], pointIndex) => <circle className={`curve-marker curve-${index % 4}`} cx={mapX(x)} cy={mapY(y)} r="4" key={`${x}-${y}-${pointIndex}`} />)}
        </g>
      ))}
      <g className="scientific-legend">
        {curves.map((curve, index) => {
          const x = LEFT + index * 158;
          return <g key={`legend-${prefix}-${curve.label}`} transform={`translate(${x} 24)`}><line className={`scientific-curve curve-${index % 4}`} x1="0" x2="28" y1="0" y2="0" strokeDasharray={curve.dashed ? '8 5' : undefined} /><SvgLabel x={36} y={4} text={curve.label} anchor="start" width={118} /></g>;
        })}
      </g>
    </>
  );
}

function FlowGraphic({ figure, markerId }: { figure: Extract<FigureIndexEntry, { kind: 'flow' }>; markerId: string }) {
  const nodes = new Map(figure.nodes.map((node) => [node.id, node]));
  return (
    <>
      <defs><marker id={markerId} markerHeight="7" markerWidth="9" orient="auto" refX="8" refY="3.5"><path d="M0,0 L9,3.5 L0,7 Z" /></marker></defs>
      <g className="scientific-edges">
        {figure.edges.map((edge, index) => {
          const from = nodes.get(edge.from);
          const to = nodes.get(edge.to);
          if (!from || !to) return null;
          const fromX = mapX(from.x); const fromY = mapY(from.y); const toX = mapX(to.x); const toY = mapY(to.y);
          const dx = toX - fromX; const dy = toY - fromY;
          const boundaryScale = 1 / Math.max(Math.abs(dx) / 72, Math.abs(dy) / 27, 1);
          const x1 = fromX + dx * boundaryScale; const y1 = fromY + dy * boundaryScale;
          const x2 = toX - dx * boundaryScale; const y2 = toY - dy * boundaryScale;
          return <g key={`${edge.from}-${edge.to}-${index}`}><line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${markerId})`} strokeDasharray={edge.dashed ? '9 6' : undefined} />{edge.label && <SvgLabel className="edge-label" x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} text={edge.label} />}</g>;
        })}
      </g>
      <g className="scientific-nodes">
        {figure.nodes.map((node) => {
          const x = mapX(node.x); const y = mapY(node.y);
          return <g className={node.tone === 'accent' ? 'node-accent' : undefined} transform={`translate(${x} ${y})`} key={node.id}><rect x="-72" y="-27" width="144" height="54" /><SvgLabel x={0} y={5} text={node.label} /></g>;
        })}
      </g>
    </>
  );
}

function PlotGraphic({ figure }: { figure: Extract<FigureIndexEntry, { kind: 'plot' }> }) {
  return <><Axes xLabel={figure.xLabel} yLabel={figure.yLabel} /><Curves curves={figure.curves} prefix={figure.id} />{figure.annotations?.map((item, index) => <g className="scientific-annotation" key={`${item.label}-${index}`}><circle cx={mapX(item.x)} cy={mapY(item.y)} r="3" /><SvgLabel x={mapX(item.x)} y={mapY(item.y) - 10} text={item.label} /></g>)}</>;
}

function TimelineGraphic({ figure, markerId, locale }: { figure: Extract<FigureIndexEntry, { kind: 'timeline' }>; markerId: string; locale: Locale }) {
  const laneY = (lane: number) => TOP + 60 + lane * (220 / Math.max(1, figure.lanes.length - 1));
  return (
    <>
      <defs><marker id={markerId} markerHeight="7" markerWidth="9" orient="auto" refX="8" refY="3.5"><path d="M0,0 L9,3.5 L0,7 Z" /></marker></defs>
      {figure.lanes.map((lane, index) => <g className="timeline-lane" key={lane}><SvgLabel x={LEFT - 12} y={laneY(index) + 4} text={lane} anchor="end" width={110} /><line x1={LEFT} x2={RIGHT} y1={laneY(index)} y2={laneY(index)} /></g>)}
      {figure.links?.map((link, index) => {
        const from = figure.events[link.from]; const to = figure.events[link.to];
        if (!from || !to) return null;
        const x1 = mapX(from.x); const y1 = laneY(from.lane); const x2 = mapX(to.x); const y2 = laneY(to.lane);
        return <g className="scientific-edges" key={`link-${index}`}><line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${markerId})`} strokeDasharray={link.dashed ? '9 6' : undefined} />{link.label && <SvgLabel className="edge-label" x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} text={link.label} />}</g>;
      })}
      {figure.events.map((event, index) => <g className={`timeline-event ${event.tone === 'accent' ? 'event-accent' : ''}`} key={`${event.label}-${index}`}><circle cx={mapX(event.x)} cy={laneY(event.lane)} r="7" /><SvgLabel x={mapX(event.x)} y={laneY(event.lane) - 18} text={event.label} /></g>)}
      <text className="timeline-direction" x={RIGHT} y={382} textAnchor="end">{locale === 'zh' ? '时间 / 顺序' : 'Time / order'} →</text>
    </>
  );
}

function StateSpaceGraphic({ figure }: { figure: Extract<FigureIndexEntry, { kind: 'state-space' }> }) {
  return (
    <>
      <Axes xLabel={figure.xLabel} yLabel={figure.yLabel} />
      <Curves curves={figure.nullclines} prefix={`${figure.id}-nullcline`} />
      {figure.trajectories.map((curve, index) => <path className={`scientific-trajectory trajectory-${index % 2}`} d={curvePath(curve)} key={curve.label} strokeDasharray={curve.dashed ? '9 6' : undefined} />)}
      {figure.fixedPoints?.map((point) => <g className="fixed-point" key={point.label}><circle className={point.stable ? 'stable' : 'unstable'} cx={mapX(point.x)} cy={mapY(point.y)} r="7" /><SvgLabel x={mapX(point.x)} y={mapY(point.y) - 14} text={point.label} /></g>)}
      {figure.annotations?.map((item, index) => <SvgLabel className="scientific-annotation" x={mapX(item.x)} y={mapY(item.y)} text={item.label} key={`${item.label}-${index}`} />)}
    </>
  );
}

export function ScientificFigure({ figure, locale = 'zh', compact = false }: { figure: FigureIndexEntry; locale?: Locale; compact?: boolean }) {
  const titleId = `${figure.id}-svg-title`;
  const descriptionId = `${figure.id}-svg-description`;
  const markerId = `${figure.id.replace(/[^A-Za-z0-9_-]/g, '-')}-arrow`;
  return (
    <figure className={`scientific-figure${compact ? ' scientific-figure-compact' : ''}`} id={figure.id}>
      <div className="scientific-canvas" role="group" aria-label={locale === 'zh' ? `${scientificTextPlainText(figure.title)} 图形区域，可横向滚动` : `${scientificTextPlainText(figure.title)} figure; scroll horizontally if needed`}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
          <title id={titleId}>{scientificTextPlainText(figure.alt)}</title>
          <desc id={descriptionId}>{scientificTextPlainText(figure.caption)}</desc>
          {figure.kind === 'flow' && <FlowGraphic figure={figure} markerId={markerId} />}
          {figure.kind === 'plot' && <PlotGraphic figure={figure} />}
          {figure.kind === 'timeline' && <TimelineGraphic figure={figure} markerId={markerId} locale={locale} />}
          {figure.kind === 'state-space' && <StateSpaceGraphic figure={figure} />}
        </svg>
      </div>
      <figcaption><strong><ScientificText text={`${figure.title}${locale === 'zh' ? '。' : '.'}`} /></strong> <ScientificText text={figure.caption} /> <span className="figure-source">{locale === 'zh' ? '来源：' : 'Sources: '}{figure.sourceRefs.map((ref, index) => <span key={`${ref.file}-${ref.page}`}>{index ? (locale === 'zh' ? '；' : '; ') : ''}<a href={`${assetPath(`/resources/original/${encodeURIComponent(ref.file)}`)}#page=${ref.page}`}>{ref.file}{locale === 'zh' ? `，第 ${ref.page} 页` : `, p. ${ref.page}`}</a></span>)}. {locale === 'zh' ? '示意图。' : 'Schematic.'}</span></figcaption>
    </figure>
  );
}
