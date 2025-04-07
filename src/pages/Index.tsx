
import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import RiskDistributionChart from '@/components/RiskDistributionChart';
import PatientSearchBar, { PatientFilters } from '@/components/PatientSearchBar';
import PatientList from '@/components/PatientList';
import AlertsPanel from '@/components/AlertsPanel';
import { 
  mockPatients, 
  riskDistribution,
  mockAlerts, 
  Patient, 
  Alert
} from '@/utils/mockData';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RiskLevelBadge from '@/components/RiskLevelBadge';
import PatientRiskTimeline from '@/components/PatientRiskTimeline';
import { ArrowLeft, Calendar, Clock, Download, FileText, Mail, Phone, UserRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<PatientFilters>({
    riskLevel: [],
    ageRange: null,
    conditions: []
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showAlerts, setShowAlerts] = useState(false);
  const { toast } = useToast();

  // Get unread alerts count
  const unreadAlertsCount = alerts.filter(alert => !alert.isRead).length;

  // Handle patient click
  const handlePatientClick = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
    }
  };

  // Handle mark alert as read
  const handleMarkAlertAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );

    toast({
      title: "Alert marked as read",
      duration: 2000,
    });
  };

  // Handle mark all alerts as read
  const handleMarkAllAlertsAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, isRead: true }))
    );

    toast({
      title: "All alerts marked as read",
      duration: 2000,
    });
  };

  // Get risk factors based on patient data
  const getRiskFactors = (patient: Patient): { factor: string; impact: 'high' | 'medium' | 'low' }[] => {
    const factors = [];
    
    // Add conditions as risk factors
    for (const condition of patient.conditions) {
      let impact: 'high' | 'medium' | 'low' = 'medium';
      
      // Determine impact level based on condition and patient data
      if (condition === 'Heart Disease' || condition === 'Chronic Kidney Disease') {
        impact = 'high';
      } else if (
        condition === 'Hypertension' && 
        patient.conditions.includes('Diabetes Type 2')
      ) {
        impact = 'high';
      } else if (condition === 'Obesity' && patient.age > 50) {
        impact = 'medium';
      } else if (condition === 'Asthma' || condition === 'Arthritis') {
        impact = 'low';
      }
      
      factors.push({ factor: condition, impact });
    }
    
    // Add age as a risk factor if patient is over 65
    if (patient.age > 65) {
      factors.push({ 
        factor: 'Age above 65',
        impact: patient.age > 75 ? 'high' : 'medium'
      });
    }
    
    return factors;
  };

  // Get intervention recommendations based on patient risk factors
  const getRecommendations = (patient: Patient): string[] => {
    const recommendations = [];
    
    // Base recommendations on conditions
    if (patient.conditions.includes('Hypertension')) {
      recommendations.push('Regular blood pressure monitoring');
      recommendations.push('Dietary sodium reduction plan');
    }
    
    if (patient.conditions.includes('Diabetes Type 2')) {
      recommendations.push('HbA1c level check every 3 months');
      recommendations.push('Referral to diabetic education program');
    }
    
    if (patient.conditions.includes('Heart Disease')) {
      recommendations.push('Cardiology follow-up within 2 weeks');
      recommendations.push('Echocardiogram evaluation');
    }
    
    if (patient.conditions.includes('Obesity')) {
      recommendations.push('Nutritional counseling referral');
      recommendations.push('Structured weight management program');
    }
    
    if (patient.riskLevel === 'high') {
      recommendations.push('Weekly telehealth check-ins');
      recommendations.push('Comprehensive medication review');
    }
    
    // Ensure we have at least some general recommendations
    if (recommendations.length < 2) {
      recommendations.push('Regular wellness check-ups');
      recommendations.push('Health education resources');
    }
    
    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Dashboard Header */}
        <DashboardHeader 
          riskDistribution={riskDistribution}
          totalPatients={mockPatients.length}
          unreadAlerts={unreadAlertsCount}
          onAlertsClick={() => setShowAlerts(true)}
        />

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RiskDistributionChart data={riskDistribution} />
          </div>
          <div className="lg:col-span-1 grid grid-cols-1 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Risk Level Distribution</CardTitle>
                <CardDescription>Overview of patient risk categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-risk-high mr-2"></div>
                      <span>High Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{riskDistribution.high}</span>
                      <span className="text-gray-500 text-sm">
                        ({Math.round((riskDistribution.high / mockPatients.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-risk-medium mr-2"></div>
                      <span>Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{riskDistribution.medium}</span>
                      <span className="text-gray-500 text-sm">
                        ({Math.round((riskDistribution.medium / mockPatients.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-risk-low mr-2"></div>
                      <span>Low Risk</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{riskDistribution.low}</span>
                      <span className="text-gray-500 text-sm">
                        ({Math.round((riskDistribution.low / mockPatients.length) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Weekly Trend</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-risk-high text-sm font-medium flex items-center">
                        ↑ 12%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">High Risk</span>
                    </div>
                    <div className="flex items-center">
                      <div className="text-risk-low text-sm font-medium flex items-center">
                        ↓ 5%
                      </div>
                      <span className="text-xs text-gray-500 ml-2">Low Risk</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Recent Alerts</CardTitle>
                <CardDescription>Latest patient risk notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-none">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        {alert.patientName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm">{alert.patientName}</div>
                          {!alert.isRead && <div className="h-2 w-2 rounded-full bg-blue-500"></div>}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 mb-1">{alert.message}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setShowAlerts(true)}
                >
                  View all alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patient Search & List */}
        <div className="bg-white rounded-lg shadow p-6">
          <PatientSearchBar
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
          />
          <PatientList
            patients={mockPatients}
            searchQuery={searchQuery}
            filters={filters}
            onPatientClick={handlePatientClick}
          />
        </div>

        {/* Alerts Panel */}
        <AlertsPanel
          alerts={alerts}
          open={showAlerts}
          onOpenChange={setShowAlerts}
          onMarkAsRead={handleMarkAlertAsRead}
          onMarkAllAsRead={handleMarkAllAlertsAsRead}
        />

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedPatient(null)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span>Patient Risk Profile</span>
                </DialogTitle>
                <DialogDescription>
                  View detailed risk assessment and intervention recommendations
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="lg:w-1/3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                          <UserRound className="h-10 w-10 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                        <div className="text-gray-500">
                          {selectedPatient.id} • {selectedPatient.age} years • {selectedPatient.gender}
                        </div>
                        <div className="mt-3">
                          <RiskLevelBadge level={selectedPatient.riskLevel} size="lg" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{selectedPatient.contactInfo.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{selectedPatient.contactInfo.email}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Medical Conditions</h3>
                          <div className="space-y-1">
                            {selectedPatient.conditions.map((condition) => (
                              <div 
                                key={condition} 
                                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md"
                              >
                                {condition}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <h3 className="text-sm font-medium text-gray-500 mb-2">Last Checkup</h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{selectedPatient.lastCheckup}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base font-medium">Risk Assessment</CardTitle>
                          <div className="text-2xl font-bold">{selectedPatient.riskScore}%</div>
                        </div>
                        <CardDescription>Current risk score</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative h-4 w-full bg-gray-100 rounded-full mb-4">
                          <div 
                            className="absolute top-0 left-0 h-4 rounded-full risk-gradient"
                            style={{ width: '100%' }}
                          ></div>
                          <div 
                            className="absolute top-0 left-0 h-6 w-6 rounded-full border-2 border-white bg-primary transform -translate-y-1 shadow-md flex items-center justify-center text-[10px] text-white"
                            style={{ left: `calc(${selectedPatient.riskScore}% - 12px)` }}
                          >
                            {selectedPatient.riskScore}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Low Risk</span>
                          <span>Medium Risk</span>
                          <span>High Risk</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Next Steps</CardTitle>
                        <CardDescription>
                          Recommendations based on risk profile
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              Follow-up appointment: <span className="font-medium">7 days</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              Risk reassessment: <span className="font-medium">30 days</span>
                            </span>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <Button size="sm" className="w-full flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span>Download Report</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                      <TabsTrigger value="timeline">Risk Timeline</TabsTrigger>
                      <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="timeline" className="pt-0">
                      <PatientRiskTimeline patient={selectedPatient} />
                    </TabsContent>
                    
                    <TabsContent value="factors" className="pt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base font-medium">Contributing Risk Factors</CardTitle>
                          <CardDescription>
                            Factors influencing the patient's risk score
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getRiskFactors(selectedPatient).map((factor, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{factor.factor}</span>
                                <div className="flex items-center gap-2">
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    factor.impact === 'high' 
                                      ? 'bg-red-100 text-red-800' 
                                      : factor.impact === 'medium'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                  }`}>
                                    {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)} Impact
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="recommendations" className="pt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base font-medium">Intervention Recommendations</CardTitle>
                          <CardDescription>
                            Suggested actions based on patient's risk profile
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {getRecommendations(selectedPatient).map((recommendation, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div className="text-sm pt-1">{recommendation}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Index;
