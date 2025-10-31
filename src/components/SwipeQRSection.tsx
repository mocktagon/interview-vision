import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Zap, Heart, X } from "lucide-react";
import { Badge } from "./ui/badge";

interface SwipeQRSectionProps {
  listId: string;
}

export const SwipeQRSection = ({ listId }: SwipeQRSectionProps) => {
  const swipeUrl = `${window.location.origin}/swipe/${listId}`;

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Mobile Review Mode</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Review candidates on-the-go with an intuitive swipe interface or{" "}
              <a 
                href={swipeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                open webapp
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="p-4 bg-background rounded-xl border-2 border-border shadow-lg">
              <QRCodeSVG
                value={swipeUrl}
                size={140}
                level="H"
                includeMargin={false}
                fgColor="hsl(var(--foreground))"
                bgColor="hsl(var(--background))"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">Scan to start</p>
          </div>

          {/* Features */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-primary/10">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI-Powered Insights</p>
                <p className="text-xs text-muted-foreground">
                  View personality analysis, strengths, challenges, and LinkedIn insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-success/10">
                <Heart className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Swipe Right for Good Fit</p>
                <p className="text-xs text-muted-foreground">
                  Intuitive gesture controls - swipe right to accept, left to reject
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-destructive/10">
                <X className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Quick Decisions</p>
                <p className="text-xs text-muted-foreground">
                  Review resumes at coffee break speed with undo support
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                Mobile Optimized
              </Badge>
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                Touch Gestures
              </Badge>
              <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                Undo Friendly
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            💡 <span className="font-semibold">Pro tip:</span> Review candidates during commute, lunch breaks, or wherever you are
          </p>
        </div>
      </div>
    </Card>
  );
};
