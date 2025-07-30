import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationToken from "./RegistrationToken";
import OnboardingPage from "./OnboardingPage";
import { useNavigate, useSearchParams } from "react-router-dom";

export function HiringManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "registrationToken";
  return (
    <div className="flex flex-col min-h-screen pl-12 py-8">
      <h1 className="text-[40px] text-left font-semibold mb-6">
        Hiring Management
      </h1>
      <Tabs
        defaultValue={tab}
        className="w-full"
        onValueChange={(value) => {
          searchParams.set("tab", value);
          navigate(`/hr/hiring?tab=${value}`);
        }}
      >
        <TabsList className="mb-4 w-1/3">
          <TabsTrigger value="registrationToken">
            Registration Token
          </TabsTrigger>
          <TabsTrigger value="onboardingApplication">
            Onboarding Application
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrationToken">
          <RegistrationToken />
        </TabsContent>

        <TabsContent value="onboardingApplication">
          <OnboardingPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
