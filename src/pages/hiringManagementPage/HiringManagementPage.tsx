import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationToken from "./RegistrationToken";
import OnboardingPage from "./OnboardingPage";

export function HiringManagementPage() {
  return (
    <div className="flex flex-col min-h-screen pl-12 py-8">
      <h1 className="text-[40px] text-left font-semibold mb-6">
        Hiring Management
      </h1>
      <Tabs defaultValue="registrationToken" className="w-full">
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
