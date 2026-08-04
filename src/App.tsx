import { AuthProvider, useAuth } from "@/lib/auth-context";
import { DataStoreProvider } from "@/lib/data-store";
import { AppProvider, useApp } from "@/lib/app-context";
import { AppShell } from "@/components/layout/AppShell";
import { Login } from "@/pages/Login";
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
import { ActivityJournal } from "@/pages/ActivityJournal";
import { navItems } from "@/lib/nav-config";
import { Toaster } from "@/components/ui/toaster";
import { ShieldAlert } from "lucide-react";

function Screens() {
  const { screen, role } = useApp();

  // Garde-fou : un écran retiré du périmètre du rôle n'est jamais rendu.
  const allowed = navItems.find((n) => n.id === screen)?.roles.includes(role);
  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShieldAlert className="h-8 w-8 text-slate-300" />
        <h2 className="mt-4 font-display text-lg font-bold text-tc-navy">
          Cette section n'est pas accessible avec votre rôle
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Choisissez une autre section dans le menu de gauche.
        </p>
      </div>
    );
  }

  switch (screen) {
    case "home": return <Home />;
    case "employeeDashboard": return <EmployeeDashboard />;
    case "passport": return <DigitalPassport />;
    case "supervisorDashboard": return <SupervisorDashboard />;
    case "psfce": return <PSFCEScreen />;
    case "managerDashboard": return <ManagerDashboard />;
    case "passsstDashboard": return <PassSSTDashboard />;
    case "hrDashboard": return <HRDashboard />;
    case "trainingCenter": return <TrainingCenter />;
    case "matrix": return <TrainingMatrix />;
    case "powerbi": return <PowerBIView />;
    case "evidenceLibrary": return <EvidenceLibrary />;
    case "activity": return <ActivityJournal />;
    default: return <Home />;
  }
}

function AuthenticatedApp() {
  return (
    <AppProvider>
      <AppShell>
        <Screens />
      </AppShell>
    </AppProvider>
  );
}

function Gate() {
  const { account } = useAuth();
  if (!account) return <Login />;
  return <AuthenticatedApp />;
}

function App() {
  return (
    <AuthProvider>
      <DataStoreProvider>
        <Gate />
        <Toaster />
      </DataStoreProvider>
    </AuthProvider>
  );
}

export default App;
