import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Zap, Heart } from "lucide-react";

interface SwipeQRSectionProps {
  listId: string;
}

export const SwipeQRSection = ({ listId }: SwipeQRSectionProps) => {
  const swipeUrl = `${window.location.origin}/swipe/${listId}`;

  return (
    <Card className="p-6 bg-card border border-border relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-foreground">
                <Smartphone className="h-4 w-4 text-background" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                Mobile Review
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Swipe through candidates on-the-go or{" "}
              <a 
                href={swipeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-semibold"
              >
                open here
              </a>
            </p>
          </div>

          {/* Right side - QR Code */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-foreground" />
                <span className="text-muted-foreground">AI Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-success" />
                <span className="text-muted-foreground">Swipe Interface</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="p-3 bg-background rounded-xl border border-border shadow-sm">
                <QRCodeSVG
                  value={swipeUrl}
                  size={100}
                  level="H"
                  includeMargin={false}
                  fgColor="hsl(var(--foreground))"
                  bgColor="hsl(var(--background))"
                />
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-1.5 font-medium">Scan to review</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-semibold">Pro tip:</span> Review candidates during commute, lunch breaks, or wherever you are
          </p>
        </div>
      </div>
    </Card>
  );
};
