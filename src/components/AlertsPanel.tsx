
import { useState } from "react";
import { Alert as AlertType } from "@/utils/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";

interface AlertsPanelProps {
  alerts: AlertType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

const AlertsPanel = ({
  alerts,
  open,
  onOpenChange,
  onMarkAsRead,
  onMarkAllAsRead
}: AlertsPanelProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const readAlerts = alerts.filter(alert => alert.isRead);
  
  const displayedAlerts = activeTab === "all" 
    ? alerts 
    : activeTab === "unread" 
      ? unreadAlerts 
      : readAlerts;

  const formatAlertTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getAlertTypeStyle = (type: AlertType["type"]) => {
    switch (type) {
      case "risk-increase":
        return "bg-red-100 text-red-800";
      case "missed-appointment":
        return "bg-yellow-100 text-yellow-800";
      case "new-condition":
        return "bg-purple-100 text-purple-800";
      case "medication":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAlertTypeLabel = (type: AlertType["type"]) => {
    switch (type) {
      case "risk-increase":
        return "Risk Increase";
      case "missed-appointment":
        return "Missed Appointment";
      case "new-condition":
        return "New Condition";
      case "medication":
        return "Medication";
      default:
        return "Alert";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Alerts & Notifications</span>
            </SheetTitle>
            {unreadAlerts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                <span className="text-xs">Mark all read</span>
              </Button>
            )}
          </div>
          <SheetDescription>
            Stay updated on patient risk changes and important events
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">
              All ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadAlerts.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {displayedAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No {activeTab} alerts</p>
                </div>
              ) : (
                displayedAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 border rounded-lg relative ${!alert.isRead ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{alert.patientName}</h4>
                      <Badge variant="outline" className={`text-xs ${getAlertTypeStyle(alert.type)}`}>
                        {getAlertTypeLabel(alert.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{formatAlertTime(alert.timestamp)}</span>
                      {!alert.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onMarkAsRead(alert.id)}
                          className="h-7 px-2"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          <span className="text-xs">Mark as read</span>
                        </Button>
                      )}
                    </div>
                    {!alert.isRead && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default AlertsPanel;
