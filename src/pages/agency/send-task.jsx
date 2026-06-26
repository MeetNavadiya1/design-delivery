import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  BriefcaseBusiness,
  Copy,
  Mail,
  Smartphone,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { agencyTaskService } from "../../services/agency-task-service";
import { HandleError } from "../../services/handleError";
import { toast } from "sonner";

export default function SendTask() {
  const [copied, setCopied] = useState(false);
  const [assetData, setAssetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingWhatsapp, setIsSendingWhatsapp] = useState(false);
  const { state } = useLocation();
  const { aid } = useParams();
  const reviewLink = state?.publicUrl || "";

  useEffect(() => {
    if (!aid) {
      setIsLoading(false);
      return;
    }

    const loadAsset = async () => {
      try {
        setIsLoading(true);
        const response = await agencyTaskService.getAssetById(aid);
        if (response.success) {
          setAssetData(response.data);
        }
      } catch (error) {
        HandleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsset();
  }, [aid]);

  const handleCopy = async () => {
    if (!reviewLink) return;

    try {
      await navigator.clipboard.writeText(reviewLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy review link", error);
    }
  };

  const handleShareEmail = async () => {
    if (!assetData?.email || !reviewLink) return;

    try {
      setIsSendingEmail(true);
      const response = await agencyTaskService.shareAssetViaEmail({
        email: assetData.email.toLowerCase(),
        publicAssetLink: reviewLink,
      });

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to share asset via email");
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleShareWhatsapp = async () => {
    if (!assetData?.mobileNumber || !reviewLink) return;

    try {
      setIsSendingWhatsapp(true);
      const response = await agencyTaskService.shareAssetViaWhatsapp({
        phoneNumber: '+91'+assetData.mobileNumber,
        publicAssetLink: reviewLink,
      });

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to share asset via WhatsApp");
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setIsSendingWhatsapp(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      <h2 className="text-xl font-medium">Send For Review</h2>
      <div className="grid grid-cols-1 w-full gap-6 ">
        <div className="flex flex-col gap-2 bg-slate-100 p-5 rounded-xl">
          <div className="flex gap-3">
            <p className="text-sm font-medium text-slate-500">Task</p>
            <Badge className="rounded-full bg-amber-100 px-2.5 text-amber-700 hover:bg-amber-100">
              {`v${assetData?.version || "-"}`}
            </Badge>
          </div>

          <h2 className="text-xl font-medium text-slate-950">
            {assetData?.name || "Asset review"}
          </h2>

          <span className="inline-flex items-center gap-2">
            <BriefcaseBusiness className="size-4" />
            {assetData?.agencyName || "-"}
          </span>
        </div>

        <div className="space-y-3">
          <label
            htmlFor="review-link"
            className="text-md font-medium text-black"
          >
            Client review link
          </label>
          <div className="flex flex-col gap-3 lg:flex-row mt-2">
            <Input
              id="review-link"
              readOnly
              value={reviewLink}
              placeholder={
                isLoading ? "Loading review link..." : "Review link unavailable"
              }
              className="h-10 font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCopy}
              disabled={!reviewLink}
              className="w-full lg:w-40"
            >
              <Copy className="size-4.5" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-md font-medium text-black">Share via</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleShareWhatsapp}
              disabled={!reviewLink || !assetData?.mobileNumber || isSendingWhatsapp}
              className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              <Smartphone className="size-4.5" />
              {isSendingWhatsapp ? "Sending..." : "WhatsApp"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleShareEmail}
              disabled={!reviewLink || !assetData?.email || isSendingEmail}
              className="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
            >
              <Mail className="size-4.5" />
              {isSendingEmail ? "Sending..." : "Email"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
