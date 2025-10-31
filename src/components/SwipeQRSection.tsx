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
    <Card className="p-8 bg-card border border-border relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30">
              <Smartphone className="h-4 w-4 text-foreground" />
              <span className="text-xs font-medium tracking-wide uppercase text-foreground">Mobile Review</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground tracking-tight">
              Quick swipe reviews
            </h3>
            <p className="text-base text-muted-foreground max-w-lg">
              Review candidates on-the-go with an intuitive swipe interface or{" "}
              <a 
                href={swipeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium underline decoration-muted-foreground hover:decoration-foreground"
              >
                open here
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* QR Code */}
          <div className="flex-shrink-0">
            <div className="p-6 bg-background rounded-2xl border border-border">
              <QRCodeSVG
                value={swipeUrl}
                size={160}
                level="H"
                includeMargin={false}
                fgColor="hsl(var(--foreground))"
                bgColor="hsl(var(--background))"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3 font-medium">Scan to review</p>
          </div>

          {/* Features */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 rounded-xl bg-secondary border border-border group-hover:border-foreground/20 transition-colors">
                <Zap className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground mb-1">AI-Powered Insights</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Personality analysis, strengths, challenges, and LinkedIn insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 rounded-xl bg-secondary border border-border group-hover:border-success/30 transition-colors">
                <Heart className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground mb-1">Intuitive Gestures</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Swipe right to accept, left to reject with full undo support
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 rounded-xl bg-secondary border border-border group-hover:border-destructive/30 transition-colors">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground mb-1">Fast Decisions</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Review at speed without compromising on quality
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="px-3 py-1 bg-secondary/50 border-border text-foreground font-medium">
              Mobile Optimized
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-secondary/50 border-border text-foreground font-medium">
              Touch Gestures
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-secondary/50 border-border text-foreground font-medium">
              Undo Friendly
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
