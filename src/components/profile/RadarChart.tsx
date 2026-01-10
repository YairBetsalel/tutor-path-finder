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

  // Calculate average score to determine gradient position
  const avgScore = Object.values(metrics).reduce((a, b) => a + b, 0) / 5;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <defs>
          {/* Multi-directional gradient across the shape */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
            <stop offset="35%" stopColor="#2979FF" stopOpacity={0.85} />
            <stop offset="65%" stopColor="#FF6D6D" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFB347" stopOpacity={0.9} />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="35%" stopColor="#2979FF" />
            <stop offset="65%" stopColor="#FF6D6D" />
            <stop offset="100%" stopColor="#FFB347" />
          </linearGradient>
        </defs>
        <PolarGrid 
          stroke="hsl(220, 15%, 75%)" 
          strokeOpacity={0.6}
        />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ 
            fill: 'hsl(220, 20%, 25%)', 
            fontSize: 12, 
            fontFamily: 'Space Grotesk',
            fontWeight: 500
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: 'hsl(220, 15%, 50%)', fontSize: 10 }}
          tickCount={6}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke="url(#radarStroke)"
          fill="url(#radarGradient)"
          fillOpacity={0.92}
          strokeWidth={3}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
