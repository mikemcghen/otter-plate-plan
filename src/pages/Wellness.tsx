import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WellnessToday } from "@/components/WellnessToday";
import { WellnessWeek } from "@/components/WellnessWeek";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function Wellness() {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-4 pt-8 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="today" className="text-sm font-medium">
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="text-sm font-medium">
              Week
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-0">
            <WellnessToday />
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <WellnessWeek />
          </TabsContent>
        </Tabs>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}
