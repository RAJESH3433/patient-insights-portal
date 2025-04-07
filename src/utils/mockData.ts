
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  conditions: string[];
  lastCheckup: string;
  contactInfo: {
    email: string;
    phone: string;
  };
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "risk-increase" | "missed-appointment" | "new-condition" | "medication";
}

// Generate mock patient data
export const generateMockPatients = (count: number): Patient[] => {
  const patients: Patient[] = [];
  const conditions = [
    "Hypertension",
    "Diabetes Type 2",
    "Obesity",
    "Heart Disease",
    "Asthma",
    "COPD",
    "Depression",
    "Anxiety",
    "Arthritis",
    "Chronic Kidney Disease"
  ];

  for (let i = 1; i <= count; i++) {
    const randomRiskLevel = Math.random();
    let riskLevel: "high" | "medium" | "low";
    let riskScore: number;

    if (randomRiskLevel < 0.25) {
      riskLevel = "high";
      riskScore = Math.floor(Math.random() * 21) + 80; // 80-100
    } else if (randomRiskLevel < 0.6) {
      riskLevel = "medium";
      riskScore = Math.floor(Math.random() * 30) + 50; // 50-79
    } else {
      riskLevel = "low";
      riskScore = Math.floor(Math.random() * 40) + 10; // 10-49
    }

    // Random conditions (1-3)
    const patientConditions: string[] = [];
    const numConditions = Math.floor(Math.random() * 3) + 1;
    const shuffledConditions = [...conditions].sort(() => 0.5 - Math.random());
    patientConditions.push(...shuffledConditions.slice(0, numConditions));

    // Random date in the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    const lastCheckup = new Date(
      sixMonthsAgo.getTime() + Math.random() * (today.getTime() - sixMonthsAgo.getTime())
    ).toISOString().split('T')[0];

    patients.push({
      id: `P${1000 + i}`,
      name: `Patient ${i}`,
      age: Math.floor(Math.random() * 60) + 20, // 20-80
      gender: Math.random() > 0.5 ? "Male" : "Female",
      riskLevel,
      riskScore,
      conditions: patientConditions,
      lastCheckup,
      contactInfo: {
        email: `patient${i}@example.com`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
      }
    });
  }

  return patients;
};

// Generate risk distribution
export const getRiskDistribution = (patients: Patient[]): RiskDistribution => {
  return {
    high: patients.filter(p => p.riskLevel === "high").length,
    medium: patients.filter(p => p.riskLevel === "medium").length,
    low: patients.filter(p => p.riskLevel === "low").length
  };
};

// Generate alerts
export const generateMockAlerts = (patients: Patient[], count: number): Alert[] => {
  const alerts: Alert[] = [];
  const alertTypes: ("risk-increase" | "missed-appointment" | "new-condition" | "medication")[] = [
    "risk-increase", 
    "missed-appointment", 
    "new-condition", 
    "medication"
  ];
  
  const alertMessages = {
    "risk-increase": "Risk score increased significantly",
    "missed-appointment": "Missed scheduled follow-up appointment",
    "new-condition": "New condition detected in recent test results",
    "medication": "Prescription refill needed within 7 days"
  };

  // Get mostly high-risk patients for alerts
  const highRiskPatients = patients.filter(p => p.riskLevel === "high");
  const mediumRiskPatients = patients.filter(p => p.riskLevel === "medium");
  const alertPatients = [...highRiskPatients, ...mediumRiskPatients.slice(0, 5)];

  for (let i = 1; i <= count; i++) {
    const randomPatient = alertPatients[Math.floor(Math.random() * alertPatients.length)];
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    // Random time in the last 48 hours
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const alertTime = new Date(
      twoDaysAgo.getTime() + Math.random() * (now.getTime() - twoDaysAgo.getTime())
    );

    alerts.push({
      id: `A${1000 + i}`,
      patientId: randomPatient.id,
      patientName: randomPatient.name,
      message: alertMessages[alertType],
      timestamp: alertTime.toISOString(),
      isRead: Math.random() > 0.7, // 30% chance of being unread
      type: alertType
    });
  }

  // Sort by timestamp, newest first
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Initialize mock data
export const mockPatients = generateMockPatients(50);
export const riskDistribution = getRiskDistribution(mockPatients);
export const mockAlerts = generateMockAlerts(mockPatients, 15);
