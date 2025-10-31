import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Zap, Heart, Brain } from "lucide-react";

interface SwipeQRSectionProps {
  listId: string;
}

export const SwipeQRSection = ({ listId }: SwipeQRSectionProps) => {
  const swipeUrl = `${window.location.origin}/swipe/${listId}`;

  return (
    <Card className="p-8 bg-[#0a0a0a] border-[#1a1a1a] relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left side - Bold Typography */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white">
                <Smartphone className="h-5 w-5 text-black" />
              </div>
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">MOBILE REVIEW</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight leading-tight">
              Review on
              <br />
              <span className="text-gray-500">the go</span>
            </h3>
            
            <p className="text-sm text-gray-400 mt-4">
              Swipe through candidates anywhere or{" "}
              <a 
                href={swipeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:underline font-semibold"
              >
                open here
              </a>
            </p>
          </div>

          {/* Right side - QR and Features */}
          <div className="flex items-center gap-8">
            {/* Feature Pills */}
            <div className="hidden md:flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="p-2 rounded-lg bg-white/10">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 font-medium">AI Insights</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Heart className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-sm text-gray-300 font-medium">Swipe Interface</span>
              </div>
            </div>
            
            {/* QR Code with number badge */}
            <div className="relative flex-shrink-0">
              <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-full z-10">
                01
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QRCodeSVG
                  value={swipeUrl}
                  size={120}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-2 font-medium">Scan to review</p>
            </div>
          </div>
        </div>
        
        {/* Pro Tip */}
        <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
          <div className="flex items-start gap-3">
            <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-300">Pro tip:</span> Review candidates during commute, lunch breaks, or wherever you are
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
