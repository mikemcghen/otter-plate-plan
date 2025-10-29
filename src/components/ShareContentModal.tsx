import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Cookie, Apple, UtensilsCrossed, Lightbulb } from "lucide-react";
import { ValidationMessage } from "@/components/ValidationMessage";

interface ShareContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (content: {
    title: string;
    description: string;
    type: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }) => void;
}

export const ShareContentModal = ({ open, onOpenChange, onShare }: ShareContentModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("recipe");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  
  // Validation states
  const titleError = title.length > 100 ? "Too long — keep it bite-sized!" : "";
  const descriptionError = description.length > 500 ? "Way too long — Ottr needs a summary!" : "";
  const caloriesError = calories && (parseInt(calories) < 0 || parseInt(calories) > 10000)
    ? "Calories can't be negative, silly Ottr!"
    : "";
  const proteinError = protein && (parseInt(protein) < 0 || parseInt(protein) > 500)
    ? "That's a lot of protein!"
    : "";
  const carbsError = carbs && (parseInt(carbs) < 0 || parseInt(carbs) > 1000)
    ? "Carbs out of range!"
    : "";
  const fatError = fat && (parseInt(fat) < 0 || parseInt(fat) > 500)
    ? "Fat value seems off!"
    : "";

  const hasErrors = !!(titleError || descriptionError || caloriesError || proteinError || carbsError || fatError);
  
  const contentTypeIcons = {
    recipe: <UtensilsCrossed className="w-4 h-4" />,
    snack: <Cookie className="w-4 h-4" />,
    meal: <Apple className="w-4 h-4" />,
    tip: <Lightbulb className="w-4 h-4" />,
  };

  const handleShare = () => {
    if (!title.trim()) return;

    onShare({
      title,
      description,
      type: contentType,
      calories: calories ? parseInt(calories) : undefined,
      protein: protein ? parseInt(protein) : undefined,
      carbs: carbs ? parseInt(carbs) : undefined,
      fat: fat ? parseInt(fat) : undefined,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl border-2 border-border p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share with Friends
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="type">
                <div className="flex items-center gap-2">
                  {contentTypeIcons[contentType as keyof typeof contentTypeIcons]}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recipe">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Recipe</span>
                  </div>
                </SelectItem>
                <SelectItem value="snack">
                  <div className="flex items-center gap-2">
                    <Cookie className="w-4 h-4" />
                    <span>Snack</span>
                  </div>
                </SelectItem>
                <SelectItem value="meal">
                  <div className="flex items-center gap-2">
                    <Apple className="w-4 h-4" />
                    <span>Meal</span>
                  </div>
                </SelectItem>
                <SelectItem value="tip">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Tip</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Title</Label>
              <span className={`text-xs ${title.length > 100 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {title.length}/100
              </span>
            </div>
            <Input
              id="title"
              placeholder="Give it a catchy name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
            {titleError && <ValidationMessage type="error" message={titleError} />}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <span className={`text-xs ${description.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Share the details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={520}
            />
            {descriptionError && <ValidationMessage type="error" message={descriptionError} />}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                max="10000"
              />
              {caloriesError && <ValidationMessage type="error" message={caloriesError} className="col-span-2" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="0"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                max="500"
              />
              {proteinError && <ValidationMessage type="error" message={proteinError} className="col-span-2" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="0"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                max="1000"
              />
              {carbsError && <ValidationMessage type="error" message={carbsError} className="col-span-2" />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="0"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                max="500"
              />
              {fatError && <ValidationMessage type="error" message={fatError} className="col-span-2" />}
            </div>
          </div>

          <Button
            className="w-full h-12 rounded-2xl"
            onClick={handleShare}
            disabled={!title.trim() || hasErrors}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share with Friends
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
