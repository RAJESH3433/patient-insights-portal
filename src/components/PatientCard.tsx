
import { Patient } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import RiskLevelBadge from "./RiskLevelBadge";
import { CalendarClock, ChevronRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientCardProps {
  patient: Patient;
  onClick: (patientId: string) => void;
}

const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  return (
    <Card className="cursor-pointer card-hover" onClick={() => onClick(patient.id)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{patient.name}</h3>
            <div className="text-sm text-gray-500 mb-1">{patient.id} • {patient.age} yrs • {patient.gender}</div>
            
            <div className="flex gap-2 items-center mb-4">
              <RiskLevelBadge level={patient.riskLevel} size="sm" />
              <span className="text-sm font-medium">Score: {patient.riskScore}</span>
            </div>
          </div>
          
          <ChevronRight className="text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{patient.lastCheckup}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-600">{patient.contactInfo.phone}</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Conditions</h4>
          <div className="flex flex-wrap gap-1">
            {patient.conditions.map((condition) => (
              <span 
                key={condition} 
                className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;
