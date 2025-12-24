import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface RadarChartProps {
  metrics: {
    focus: number;
    skill: number;
    revision: number;
    attitude: number;
    potential: number;
  };
}

export function RadarChart({ metrics }: RadarChartProps) {
  const data = [
    { subject: 'Focus', value: metrics.focus, fullMark: 5 },
    { subject: 'Skill', value: metrics.skill, fullMark: 5 },
    { subject: 'Revision', value: metrics.revision, fullMark: 5 },
    { subject: 'Attitude', value: metrics.attitude, fullMark: 5 },
    { subject: 'Potential', value: metrics.potential, fullMark: 5 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="hsl(180, 15%, 85%)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: 'hsl(180, 40%, 15%)', fontSize: 12, fontFamily: 'Inter' }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: 'hsl(180, 15%, 45%)', fontSize: 10 }}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="hsl(175, 75%, 25%)"
          fill="hsl(175, 75%, 25%)"
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
