import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, QrCode, Hash } from "lucide-react";

interface AddFriendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFriend: (method: string, value: string) => void;
}

export const AddFriendModal = ({ open, onOpenChange, onAddFriend }: AddFriendModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSearchAdd = () => {
    if (searchQuery.trim()) {
      onAddFriend("search", searchQuery);
      setSearchQuery("");
      onOpenChange(false);
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
              <Input
                id="search"
                placeholder="Enter friend's name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleSearchAdd}
              disabled={!searchQuery.trim()}
            >
              Send Friend Request
            </Button>
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
