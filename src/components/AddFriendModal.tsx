import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, QrCode, Hash, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import otterHappy from "@/assets/otter-happy.png";

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFriend: (method: string, value: string) => void;
}

export const AddFriendModal = ({ open, onOpenChange, onAddFriend }: AddFriendModalProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;

    setIsSearching(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike("display_name", `%${searchQuery}%`)
      .neq("id", user.id)
      .limit(5);

    setIsSearching(false);
    if (!error && data) {
      setSearchResults(data);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("friendships")
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: "pending",
      });

    if (!error) {
      toast({ title: "Friend request sent!" });
      setSearchResults([]);
      setSearchQuery("");
    } else {
      toast({ 
        title: "Error", 
        description: "Could not send friend request",
        variant: "destructive" 
      });
    }
  };

  const handleCodeAdd = () => {
    if (inviteCode.trim()) {
      onAddFriend("code", inviteCode);
      setInviteCode("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-2 border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Add Friend
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">
              <Search className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="code">
              <Hash className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search by Name</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Enter friend's name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-2xl border border-border"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={profile.avatar_url || otterHappy} />
                      <AvatarFallback>{profile.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {profile.display_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profile.title}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSendRequest(profile.id)}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Invite Code</Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCodeAdd}
              disabled={!inviteCode.trim()}
            >
              Add Friend
            </Button>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <div className="text-center text-sm text-muted-foreground py-8">
              <QrCode className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p>QR code scanning coming soon!</p>
              <p className="mt-2">Share your friend code instead</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
