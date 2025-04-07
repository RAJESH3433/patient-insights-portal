
import { useState, useMemo } from "react";
import { Patient } from "@/utils/mockData";
import PatientCard from "./PatientCard";
import { PatientFilters } from "./PatientSearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert, Clock } from "lucide-react";

interface PatientListProps {
  patients: Patient[];
  searchQuery: string;
  filters: PatientFilters;
  onPatientClick: (patientId: string) => void;
}

const PatientList = ({ patients, searchQuery, filters, onPatientClick }: PatientListProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Filter by search query
      if (
        searchQuery &&
        !patient.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !patient.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !patient.conditions.some((condition) =>
          condition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by risk level
      if (filters.riskLevel.length > 0 && !filters.riskLevel.includes(patient.riskLevel)) {
        return false;
      }

      // Filter by age range
      if (
        filters.ageRange &&
        (patient.age < filters.ageRange[0] || patient.age > filters.ageRange[1])
      ) {
        return false;
      }

      // Filter by conditions
      if (
        filters.conditions.length > 0 &&
        !filters.conditions.some((condition) =>
          patient.conditions.some((patientCondition) =>
            patientCondition.toLowerCase().includes(condition.toLowerCase())
          )
        )
      ) {
        return false;
      }

      // Filter by tab
      if (activeTab === "high-risk" && patient.riskLevel !== "high") {
        return false;
      }

      return true;
    });
  }, [patients, searchQuery, filters, activeTab]);

  const highRiskCount = patients.filter((p) => p.riskLevel === "high").length;

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <CircleAlert className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-1">No patients found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="high-risk" className="flex items-center gap-1">
            <span>High Risk</span>
            <span className="bg-risk-high text-white text-xs rounded-full px-2 py-0.5">
              {highRiskCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {filteredPatients.length} {filteredPatients.length === 1 ? "Patient" : "Patients"}
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last updated: Today at 9:42 AM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onClick={onPatientClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientList;
