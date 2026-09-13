"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { DIMENSION_META } from "@/lib/traits";
import { DIMENSIONS, type Scores } from "@/lib/types";

export function TraitRadar({ scores, baseline }: { scores: Scores; baseline?: Scores }) {
  const data = DIMENSIONS.map((d) => ({
    dimension: DIMENSION_META[d].short,
    now: scores[d],
    start: baseline?.[d] ?? 0,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#DDD6FE" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#3B0764", fontSize: 11, fontWeight: 600 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          {/* Animation disabled: re-renders from progress refreshes can leave the polygon stuck at the center. */}
          {baseline && (
            <Radar
              dataKey="start"
              stroke="#F97316"
              strokeDasharray="4 3"
              fill="#F97316"
              fillOpacity={0.08}
              isAnimationActive={false}
            />
          )}
          <Radar
            dataKey="now"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="#8B5CF6"
            fillOpacity={0.35}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
