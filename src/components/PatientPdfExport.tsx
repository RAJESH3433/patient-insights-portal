
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Patient } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Extend the jsPDF library to include the autoTable function
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PatientPdfExportProps {
  patient: Patient;
}

const PatientPdfExport = ({ patient }: PatientPdfExportProps) => {
  const { toast } = useToast();

  const handleDownloadPdf = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Patient Report: ${patient.name}`, 14, 22);
    
    // Add patient details
    doc.setFontSize(12);
    doc.text(`Patient ID: ${patient.id}`, 14, 32);
    doc.text(`Age: ${patient.age} years`, 14, 40);
    doc.text(`Gender: ${patient.gender}`, 14, 48);
    doc.text(`Risk Level: ${patient.riskLevel.toUpperCase()}`, 14, 56);
    doc.text(`Risk Score: ${patient.riskScore}`, 14, 64);
    doc.text(`Last Checkup: ${patient.lastCheckup}`, 14, 72);
    
    // Contact information
    doc.text("Contact Information:", 14, 84);
    doc.text(`Phone: ${patient.contactInfo.phone}`, 20, 92);
    doc.text(`Email: ${patient.contactInfo.email}`, 20, 100);
    doc.text(`Address: ${patient.contactInfo.address}`, 20, 108);
    
    // Add medical conditions
    doc.text("Medical Conditions:", 14, 120);
    patient.conditions.forEach((condition, index) => {
      doc.text(`• ${condition}`, 20, 128 + (index * 8));
    });
    
    // Add medications table
    const medicationsY = 128 + (patient.conditions.length * 8) + 10;
    doc.text("Current Medications:", 14, medicationsY);
    
    // Mock medications data (since it's not in the original patient data)
    const medications = [
      { name: "Medication 1", dosage: "10mg", frequency: "Daily" },
      { name: "Medication 2", dosage: "5mg", frequency: "Twice daily" },
    ];
    
    // Create a table for medications
    doc.autoTable({
      startY: medicationsY + 5,
      head: [["Medication", "Dosage", "Frequency"]],
      body: medications.map(med => [med.name, med.dosage, med.frequency]),
      margin: { left: 14 },
      theme: 'grid',
    });
    
    // Add notes section
    const notesY = doc.autoTable.previous.finalY + 20;
    doc.text("Notes:", 14, notesY);
    doc.text("This is a generated report for demonstration purposes.", 14, notesY + 10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, notesY + 20);
    
    // Save the PDF with the patient's name
    doc.save(`patient_report_${patient.id}.pdf`);
    
    // Show a success toast
    toast({
      title: "PDF Downloaded",
      description: `Patient report for ${patient.name} has been downloaded.`,
    });
  };

  return (
    <Button 
      onClick={handleDownloadPdf}
      variant="outline"
      size="sm"
      className="flex items-center gap-1 text-xs"
    >
      <Download className="h-3 w-3" />
      Download PDF
    </Button>
  );
};

export default PatientPdfExport;
