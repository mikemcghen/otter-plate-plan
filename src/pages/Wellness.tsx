import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WellnessToday } from "@/components/WellnessToday";
import { WellnessWeek } from "@/components/WellnessWeek";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Wellness() {
  const [activeTab, setActiveTab] = useState("today");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-4 pt-8 pb-24">
        {/* Daily Reflection CTA */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/wellness/reflect")}
            className="w-full py-8 text-lg font-bold rounded-3xl bg-gradient-to-r from-primary via-accent to-secondary hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6" />
              Start Daily Reflection
              <Sparkles className="w-6 h-6" />
            </span>
          </Button>
        </div>

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
