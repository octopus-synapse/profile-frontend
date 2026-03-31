'use client';

import { useI18n } from '@profile/i18n';
import { FUNNEL_STAGES } from '../data';

const W = 560;
const H = 72;
const GAP = 10;

export function FunnelChart({ visible }: { visible: boolean }) {
  const { t } = useI18n();
  const total = FUNNEL_STAGES.length;
  const viewH = total * H + (total - 1) * GAP;
  const widths = [W, W * 0.64, W * 0.4, W * 0.22];

  return (
    <svg
      viewBox={`0 0 ${W} ${viewH}`}
      className="mx-auto w-full max-w-lg"
      aria-label={t('landing.painTime.funnelAriaLabel' as never)}
    >
      {FUNNEL_STAGES.map((stage, i) => (
        <FunnelStageElement
          key={stage.label}
          stage={stage}
          index={i}
          total={total}
          widths={widths}
          visible={visible}
        />
      ))}
    </svg>
  );
}

function FunnelStageElement({
  stage,
  index,
  total,
  widths,
  visible,
}: {
  stage: (typeof FUNNEL_STAGES)[number];
  index: number;
  total: number;
  widths: number[];
  visible: boolean;
}) {
  const y = index * (H + GAP);
  const delay = index * 130;
  const trapPath = createTrapPath(index, total, widths);

  return (
    <g>
      <path
        d={trapPath}
        fill={stage.fill}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scaleY(1)' : 'scaleY(0.4)',
          transformOrigin: `${W / 2}px ${y}px`,
          transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
        }}
      />
      <text
        x={W / 2}
        y={y + H / 2 - 9}
        textAnchor="middle"
        fill={stage.text}
        fontSize={22}
        fontWeight={800}
        fontFamily="system-ui, sans-serif"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.35s ease ${delay + 220}ms`,
        }}
      >
        {stage.value.toLocaleString('pt-BR')}
      </text>
      <text
        x={W / 2}
        y={y + H / 2 + 12}
        textAnchor="middle"
        fill={stage.sub}
        fontSize={11}
        fontFamily="system-ui, sans-serif"
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity 0.35s ease ${delay + 320}ms`,
        }}
      >
        {stage.label}
        {stage.pct ? `  ·  ${stage.pct}` : ''}
      </text>
    </g>
  );
}

function createTrapPath(i: number, total: number, widths: number[]) {
  const tw = widths[i] ?? W;
  const bw = i < total - 1 ? (widths[i + 1] ?? W * 0.85) : (widths[i] ?? W) * 0.85;
  const y = i * (H + GAP);
  const r = 8;
  const top = y;
  const bot = y + H;
  const tx = (W - tw) / 2;
  const bx = (W - bw) / 2;

  return (
    `M ${tx + r},${top} ` +
    `L ${tx + tw - r},${top} ` +
    `Q ${tx + tw},${top} ${tx + tw},${top + r} ` +
    `L ${bx + bw},${bot - r} ` +
    `Q ${bx + bw},${bot} ${bx + bw - r},${bot} ` +
    `L ${bx + r},${bot} ` +
    `Q ${bx},${bot} ${bx},${bot - r} ` +
    `L ${tx},${top + r} ` +
    `Q ${tx},${top} ${tx + r},${top} Z`
  );
}
