import { AppProvider, useApp } from "@/lib/app-context";
import { AppShell } from "@/components/layout/AppShell";
import { Home } from "@/pages/Home";
import { EmployeeDashboard } from "@/pages/EmployeeDashboard";
import { DigitalPassport } from "@/pages/DigitalPassport";
import { SupervisorDashboard } from "@/pages/SupervisorDashboard";
import { PSFCEScreen } from "@/pages/PSFCEScreen";
import { ManagerDashboard } from "@/pages/ManagerDashboard";
import { PassSSTDashboard } from "@/pages/PassSSTDashboard";
import { HRDashboard } from "@/pages/HRDashboard";
import { TrainingCenter } from "@/pages/TrainingCenter";
import { TrainingMatrix } from "@/pages/TrainingMatrix";
import { PowerBIView } from "@/pages/PowerBIView";
import { EvidenceLibrary } from "@/pages/EvidenceLibrary";
import { Toaster } from "@/components/ui/toaster";

function Screens() {
  const { screen } = useApp();
  switch (screen) {
    case "home":
      return <Home />;
    case "employeeDashboard":
      return <EmployeeDashboard />;
    case "passport":
      return <DigitalPassport />;
    case "supervisorDashboard":
      return <SupervisorDashboard />;
    case "psfce":
      return <PSFCEScreen />;
    case "managerDashboard":
      return <ManagerDashboard />;
    case "passsstDashboard":
      return <PassSSTDashboard />;
    case "hrDashboard":
      return <HRDashboard />;
    case "trainingCenter":
      return <TrainingCenter />;
    case "matrix":
      return <TrainingMatrix />;
    case "powerbi":
      return <PowerBIView />;
    case "evidenceLibrary":
      return <EvidenceLibrary />;
    default:
      return <Home />;
  }
}

function Shell() {
  const { screen } = useApp();
  if (screen === "home") {
    return (
      <div className="h-screen w-full overflow-y-auto bg-tc-bg">
        <Home />
      </div>
    );
  }
  return (
    <AppShell>
      <Screens />
    </AppShell>
  );
}

function App() {
  return (
    <AppProvider>
      <Shell />
      <Toaster />
    </AppProvider>
  );
}

export default App;
