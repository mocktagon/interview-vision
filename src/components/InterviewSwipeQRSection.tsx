import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";

interface InterviewSwipeQRSectionProps {
  listId?: string;
}

export function InterviewSwipeQRSection({ listId = "all" }: InterviewSwipeQRSectionProps) {
  const swipeUrl = `${window.location.origin}/swipe-interviews/${listId}`;

  return (
    <Card className="!bg-[#0a0a0a] !border-[#1a1a1a] overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 rounded-xl !bg-white/10">
              <Smartphone className="h-6 w-6 !text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold !text-white text-lg mb-1">
                Review Interviews on Mobile
              </h3>
              <p className="text-sm !text-gray-400">
                Scan to swipe through interviews on your phone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="!bg-white p-3 rounded-lg">
              <QRCodeSVG
                value={swipeUrl}
                size={80}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
