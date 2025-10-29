import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyToggleCardProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const PrivacyToggleCard = ({
  label,
  description,
  checked,
  onCheckedChange,
  icon,
  disabled = false,
}: PrivacyToggleCardProps) => {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border transition-colors hover:bg-muted/50">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5 text-primary">{icon || <Lock className="w-5 h-5" />}</div>
        <div className="flex-1 space-y-1">
          <Label htmlFor={label} className="text-sm font-medium cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      <Switch
        id={label}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-1"
      />
    </div>
  );
};
