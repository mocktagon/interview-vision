import { Card } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Zap, Heart, Brain, Loader2, Copy, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface SwipeQRSectionProps {
  listId: string;
  searchQuery?: string;
  selectedStage?: string;
  showGoodFitsOnly?: boolean;
  minScore?: number;
  minExperience?: number;
  swipeStatus?: string;
}

export const SwipeQRSection = ({ 
  listId, 
  searchQuery, 
  selectedStage, 
  showGoodFitsOnly,
  minScore = 0,
  minExperience = 0,
  swipeStatus = 'all'
}: SwipeQRSectionProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [qrKey, setQrKey] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Generate OTP (6 digits) - regenerates when ANY filter changes
  const otp = useMemo(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, [searchQuery, selectedStage, showGoodFitsOnly, minScore, minExperience, swipeStatus]);
  
  // Build URL with query params and OTP
  const params = new URLSearchParams();
  if (searchQuery) params.set('search', searchQuery);
  if (selectedStage && selectedStage !== 'all') params.set('stage', selectedStage);
  if (showGoodFitsOnly) params.set('goodFits', 'true');
  params.set('otp', otp);
  
  const queryString = params.toString();
  const swipeUrl = `${window.location.origin}/swipe/${listId}${queryString ? `?${queryString}` : ''}`;

  // Trigger refresh animation when ANY filter changes - instant response
  useEffect(() => {
    setIsRefreshing(true);
    setCopied(false);
    setQrKey(prev => prev + 1); // Force QR code re-render immediately
    const timer = setTimeout(() => setIsRefreshing(false), 350); // Faster animation
    return () => clearTimeout(timer);
  }, [searchQuery, selectedStage, showGoodFitsOnly, minScore, minExperience, swipeStatus]);

  const copyOtp = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 !bg-[#0a0a0a] !border-[#1a1a1a] text-white relative overflow-hidden shadow-xl isolate">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left side - Bold Typography */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white">
                <Smartphone className="h-4 w-4 text-black" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">MOBILE REVIEW</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight leading-none">
              Review on
              <span className="text-gray-500 ml-2">the go</span>
            </h3>
            
            <p className="text-xs text-gray-400 mt-2">
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
          <div className="flex items-center gap-6">
            {/* Feature Pills */}
            <div className="hidden md:flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="p-1.5 rounded-lg bg-white/10">
                  <Brain className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs text-gray-300 font-medium">AI Insights</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
                <div className="p-1.5 rounded-lg bg-green-500/10">
                  <Heart className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-xs text-gray-300 font-medium">Swipe Interface</span>
              </div>
            </div>
            
            {/* QR Code with number badge */}
            <div className="relative flex-shrink-0">
              <div className="absolute -top-1.5 -right-1.5 bg-white text-black text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                01
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xl relative transition-all duration-200">
                {isRefreshing && (
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 gap-1.5 animate-fade-in">
                    <Loader2 className="h-7 w-7 text-black animate-spin" />
                    <span className="text-[9px] font-bold text-black uppercase tracking-wider">Updating</span>
                  </div>
                )}
                <div className={`transition-all duration-200 ${isRefreshing ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                  <QRCodeSVG
                    key={qrKey}
                    value={swipeUrl}
                    size={100}
                    level="H"
                    includeMargin={false}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
              </div>
              <p className="text-[10px] text-center text-gray-500 mt-1.5 font-medium">
                {isRefreshing ? "Updating..." : "Scan to review"}
              </p>
              
              {/* OTP Display - Compact */}
              <div className="mt-2 pt-2 border-t border-gray-700/50">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="bg-white px-2.5 py-1 rounded-md font-mono text-sm font-bold text-black tracking-wider">
                    {otp}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyOtp}
                    className="h-6 w-6 p-0 hover:bg-white/10"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pro Tip */}
        <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
          <div className="flex items-start gap-2">
            <Zap className="h-3.5 w-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-300">Pro tip:</span> Review candidates during commute, lunch breaks, or wherever you are
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
