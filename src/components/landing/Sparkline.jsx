import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function Sparkline({ id, series, color, dim = false }) {
  const data = series.map((v, i) => ({ i, v }));
  const gradId = `spark-${id}`;

  return (
    <div className="h-12 w-full mt-3">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 4, right: 3, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            dataKey="v"
            type="monotone"
            stroke={color}
            strokeWidth={2}
            strokeOpacity={dim ? 0.3 : 1}
            fill={`url(#${gradId})`}
            isAnimationActive={false}
            dot={(p) => (p.index === data.length - 1 ? <circle key={p.index} cx={p.cx} cy={p.cy} r={3} fill={color} stroke="#fff" strokeWidth={1.5} /> : null)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}