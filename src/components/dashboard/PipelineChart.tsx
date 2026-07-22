"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Leads Captados", value: 2543, color: "#7C3AED" }, // Primary
  { name: "Contactados", value: 1240, color: "#8B5CF6" },
  { name: "Auditorías", value: 450, color: "#A78BFA" },
  { name: "Propuestas", value: 125, color: "#06B6D4" }, // Accent
  { name: "Cierres", value: 32, color: "#22D3EE" },
];

export function PipelineChart() {
  return (
    <Card className="glass-panel border-border/40 bg-card/40 h-[380px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Embudo de Conversión</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.8 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
              contentStyle={{ backgroundColor: 'rgba(10, 15, 30, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
