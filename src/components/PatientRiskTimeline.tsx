
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { Patient } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

interface PatientRiskTimelineProps {
  patient: Patient;
}

const PatientRiskTimeline = ({ patient }: PatientRiskTimelineProps) => {
  // Generate mock timeline data for the patient
  const generateTimelineData = () => {
    const today = new Date();
    const data = [];
    
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      
      // Add some variation to the risk score to create a trend
      // For high-risk patients, show an increasing trend
      // For medium-risk patients, show a fluctuating trend
      // For low-risk patients, show a stable trend
      let baseScore;
      let variance;
      
      if (patient.riskLevel === 'high') {
        baseScore = 60 + (i * 6); // Increasing trend (60 -> 90)
        variance = Math.random() * 10 - 5; // +/- 5
      } else if (patient.riskLevel === 'medium') {
        baseScore = 50 + (Math.sin(i) * 10); // Fluctuating around 50-60
        variance = Math.random() * 8 - 4; // +/- 4
      } else {
        baseScore = 30 + (i < 3 ? -2 : 2); // Mostly stable with slight change
        variance = Math.random() * 6 - 3; // +/- 3
      }
      
      // Ensure the most recent score matches the patient's current score
      const score = i === 0 ? patient.riskScore : Math.round(baseScore + variance);
      
      data.push({
        month: date.toLocaleString('default', { month: 'short' }),
        score: Math.max(10, Math.min(100, score)), // Ensure score is between 10 and 100
        fullDate: date.toISOString().split('T')[0]
      });
    }
    
    return data;
  };

  const timelineData = generateTimelineData();
  
  // Determine the risk level threshold lines
  const highRiskThreshold = 80;
  const mediumRiskThreshold = 50;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Risk Score Timeline</CardTitle>
          <div className="flex items-center text-sm text-gray-500 gap-1">
            <InfoIcon className="h-4 w-4" />
            <span>6-month trend</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
                tickCount={6}
              />
              <Tooltip 
                formatter={(value) => [`Risk Score: ${value}`, '']}
                labelFormatter={(label, items) => {
                  const dataPoint = timelineData.find(d => d.month === label);
                  return dataPoint ? dataPoint.fullDate : label;
                }}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <ReferenceLine 
                y={highRiskThreshold} 
                stroke="hsl(var(--risk-high))" 
                strokeDasharray="3 3" 
                label={{ value: 'High Risk', position: 'insideBottomRight', fill: 'hsl(var(--risk-high))', fontSize: 12 }}
              />
              <ReferenceLine 
                y={mediumRiskThreshold} 
                stroke="hsl(var(--risk-medium))" 
                strokeDasharray="3 3" 
                label={{ value: 'Medium Risk', position: 'insideBottomRight', fill: 'hsl(var(--risk-medium))', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4, fill: 'white' }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'white' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-risk-high mr-2"></div>
            <span className="text-xs">High Risk (80+)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-risk-medium mr-2"></div>
            <span className="text-xs">Medium Risk (50-79)</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-risk-low mr-2"></div>
            <span className="text-xs">Low Risk (0-49)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientRiskTimeline;
