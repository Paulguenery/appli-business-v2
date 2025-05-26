import { ProjectSeekerDashboard as Dashboard } from "@/components/dashboard/ProjectSeekerDashboard";
import { PremiumFeatures } from "@/components/subscription/PremiumFeatures";
import { useAuth } from "@/hooks/use-auth";

export function ProjectSeekerDashboard() {
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