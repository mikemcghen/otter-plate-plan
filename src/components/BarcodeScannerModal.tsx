import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Minus, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ErrorState } from "@/components/EmptyState";
import otterHappy from "@/assets/otter-happy.png";

interface ScannedProduct {
  barcode: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (product: ScannedProduct, servings: number) => void;
}

export function BarcodeScannerModal({ open, onOpenChange, onLog }: BarcodeScannerModalProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [servings, setServings] = useState(1);
  const [scanError, setScanError] = useState(false);

  // Mock barcode scan result - 70% success, 30% not found
  const handleScan = () => {
    const success = Math.random() > 0.3;
    
    if (success) {
      const mockProduct: ScannedProduct = {
        barcode: "012345678910",
        name: "Greek Yogurt",
        servingSize: "1 container (150g)",
        calories: 100,
        protein: 17,
        carbs: 6,
        fat: 0.7,
      };
      
      setScannedProduct(mockProduct);
      setIsScanning(false);
      setScanError(false);
    } else {
      setScanError(true);
      setIsScanning(false);
    }
  };

  const handleLog = () => {
    if (scannedProduct) {
      onLog(scannedProduct, servings);
      toast({
        title: "Logged!",
        description: `${scannedProduct.name} × ${servings} • +15 XP`,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setIsScanning(true);
    setScannedProduct(null);
    setServings(1);
    setScanError(false);
    onOpenChange(false);
  };

  const handleTryAgain = () => {
    setIsScanning(true);
    setScanError(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] sm:max-w-md rounded-3xl border-2 border-border p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={otterHappy} alt="Happy otter" className="w-10 h-10" />
              <DialogTitle className="text-2xl font-bold">Scan Barcode</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {scanError ? (
            <ErrorState
              title="Barcode Not Found"
              description="Hmm, Ottr couldn't find this product in the database. Try scanning again or add it manually through Quick Log."
              action={{
                label: "Try Scanning Again",
                onClick: handleTryAgain,
              }}
            />
          ) : isScanning ? (
            <div className="space-y-6">
              {/* Camera Scanner UI */}
              <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Camera className="w-16 h-16 text-primary mx-auto animate-pulse" />
                    <p className="text-sm text-muted-foreground px-4">
                      Position barcode within the frame
                    </p>
                  </div>
                </div>
                
                {/* Scanning frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-1/2 border-4 border-primary rounded-2xl opacity-50 animate-pulse" />
                </div>
              </div>

              {/* Mock scan button for demo */}
              <Button
                onClick={handleScan}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 text-lg font-semibold"
              >
                Simulate Scan (Demo)
              </Button>
            </div>
          ) : (
            scannedProduct && (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="bg-card border-2 border-border rounded-2xl p-4 space-y-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {scannedProduct.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {scannedProduct.servingSize}
                  </p>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="text-lg font-bold text-foreground">{scannedProduct.calories}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="text-lg font-bold text-primary">{scannedProduct.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="text-lg font-bold text-accent">{scannedProduct.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="text-lg font-bold text-orange-500">{scannedProduct.fat}g</p>
                    </div>
                  </div>
                </div>

                {/* Servings Picker */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-border rounded-2xl p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Number of servings</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="h-12 w-12 rounded-full border-2"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <div className="min-w-[80px] text-center">
                      <p className="text-4xl font-bold text-primary">{servings}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setServings(servings + 1)}
                      className="h-12 w-12 rounded-full border-2"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsScanning(true)}
                    className="flex-1 h-12 border-2"
                  >
                    Scan Again
                  </Button>
                  <Button
                    onClick={handleLog}
                    className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 font-semibold"
                  >
                    Log Food
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
