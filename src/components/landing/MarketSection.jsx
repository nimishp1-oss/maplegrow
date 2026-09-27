import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GrowthChart from '@/components/landing/GrowthChart';
import Sparkline from '@/components/landing/Sparkline';
import { growthPct } from '@/lib/marketData';

export default function MarketSection({ id, invert, eyebrow, title, subtitle, items, note }) {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <section id={id} className={`scroll-mt-16 py-20 sm:py-28 ${invert ? 'bg-[#f5f5f7]' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#86868b]">{eyebrow}</p>
          <h2 className="font-heading font-semibold text-4xl sm:text-5xl tracking-[-0.02em] text-[#1d1d1f] mt-3">{title}</h2>
          <p className="text-lg text-[#6e6e73] mt-4 max-w-2xl">{subtitle}</p>

          <div className="mt-10 bg-white border border-[#d2d2d7]/70 rounded-[28px] p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <GrowthChart items={items} activeKey={activeKey} />
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 justify-center">
              {items.map((it) => {
                const g = growthPct(it.series);
                const active = activeKey === it.key;
                return (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => setActiveKey((k) => (k === it.key ? null : it.key))}
                    className={`flex items-center gap-2 text-xs transition-all cursor-pointer ${active ? 'text-[#1d1d1f] font-semibold' : 'text-[#6e6e73] hover:text-[#1d1d1f]'}`}
                  >
                    <i className="w-2 h-2 rounded-full" style={{ background: it.color }} />
                    {it.ticker}
                    <b className={g >= 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}>{g >= 0 ? '+' : ''}{g}%</b>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-[#a1a1a6] mt-3 text-center">Tap a ticker to spotlight its growth line · tap again to release</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {items.map((it) => {
              const g = growthPct(it.series);
              const active = activeKey === it.key;
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => setActiveKey((k) => (k === it.key ? null : it.key))}
                  className={`text-left bg-white border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] ${active ? 'border-[#0071e3] ring-2 ring-[#0071e3]/15' : 'border-[#d2d2d7]/70'}`}
                >
                  <div className="text-xs text-[#86868b] truncate">{it.name}</div>
                  <div className="font-heading font-bold text-lg tracking-tight mt-0.5">{it.ticker}</div>
                  <Sparkline id={it.key} series={it.series} color={it.color} dim={!!activeKey && !active} />
                  <div className={`text-xs font-semibold mt-2 ${g >= 0 ? 'text-[#0071e3]' : 'text-[#ff3b30]'}`}>
                    {g >= 0 ? '+' : ''}{g}% <span className="text-[#86868b] font-normal">5-yr</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-[#86868b] mt-8">{note}</p>
        </motion.div>
      </div>
    </section>
  );
}