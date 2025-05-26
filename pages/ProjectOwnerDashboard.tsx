import { ProjectOwnerDashboard as Dashboard } from "@/components/dashboard/ProjectOwnerDashboard";
import { PremiumFeatures } from "@/components/subscription/PremiumFeatures";
import { useAuth } from "@/hooks/use-auth";

export function ProjectOwnerDashboard() {
  const { isPremium } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Dashboard />
        {isPremium && <PremiumFeatures />}
      </div>
    </div>
  );
}