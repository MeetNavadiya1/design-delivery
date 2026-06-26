import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import aurora from "@/assets/aurora.svg";
import { agencyTaskService } from "../../services/agency-task-service";
import { HandleError } from "../../services/handleError";
import { toast } from "sonner";

const formatVersion = (version) => (version ? `v${version}` : "Latest");

const formatToday = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getDownloadName = (name, assetLink) => {
  const cleanName = (name || "asset-review").trim().replace(/\s+/g, "-");

  try {
    const pathname = new URL(assetLink).pathname;
    const extension = pathname.split(".").pop();
    if (extension && extension.length <= 5) {
      return `${cleanName}.${extension}`;
    }
  } catch {
    return cleanName;
  }

  return cleanName;
};

const downloadAssetFile = async (assetLink, fileName) => {
  const response = await fetch(assetLink);
  if (!response.ok) {
    throw new Error("Failed to download asset");
  }

  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(objectUrl);
};

const TopNav = () => (
  <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-2">
    <img
      src={aurora}
      alt="Design Delivery Logo"
      className="h-10 max-w-full object-contain"
    />
    <span className="text-xl font-bold">Aurora</span>
  </div>
);

const DecisionResultCard = ({ type, assetName, version }) => {
  const isApproved = type === "approved";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white p-4">
      <div className="flex max-w-md flex-col items-center gap-8">
        <Card className="w-full border-gray-300 bg-gray-50 hover:shadow-xl">
          <CardHeader>
            <div
              className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${isApproved
                ? "bg-linear-to-br from-green-100 to-green-50"
                : "bg-linear-to-br from-red-100 to-red-50"
                }`}
            >
              {isApproved ? (
                <svg
                  className="h-20 w-20 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-20 w-20 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    strokeWidth="2"
                    strokeDasharray="32"
                  />
                  <path strokeLinecap="round" strokeWidth="2.5" d="M12 7v6" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <h2 className="mb-4 text-3xl capitalize font-bold text-gray-900 sm:text-4xl">
                {isApproved ? "design approved" : "design rejected"}
              </h2>
              <p className="mb-6 text-sm text-gray-600 sm:text-base">
                {isApproved
                  ? "Thank you for your feedback. The agency has been notified of your approval."
                  : "Your feedback has been sent to the designer. They'll upload a revised version shortly."}
              </p>
            </div>
            <CardTitle className="text-lg text-gray-900">
              {assetName || "Asset review"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="font-semibold">{formatVersion(version)}</span>
            </div>
            <div className="flex justify-between">
              <span>Decision</span>
              <Badge className={isApproved ? "bg-green-600" : "bg-red-600"}>
                {isApproved ? "Approved" : "rejected"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span className="font-semibold">{formatToday()}</span>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          {isApproved
            ? "This decision has been recorded. You can close this page safely."
            : "You'll receive a new link via WhatsApp or email once the rejected is ready."}
        </p>
      </div>
    </div>
  );
};

export default function ClientFeedback() {
  const { assetId } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decision, setDecision] = useState("");
  const [comment, setComment] = useState("");
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (!assetId) {
      setIsLoading(false);
      return;
    }

    const loadAsset = async () => {
      try {
        setIsLoading(true);
        const response = await agencyTaskService.getAssetById(assetId);
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
  }, [assetId]);

  const imageUrl = assetData?.assetLink || "";

  const handleOpenNewTab = () => {
    if (!imageUrl) return;
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      await downloadAssetFile(
        imageUrl,
        getDownloadName(assetData?.name, imageUrl),
      );
    } catch (error) {
      HandleError(error);
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim() || !decision || !assetId) return;

    try {
      setIsSubmittingComment(true);
      const response = await agencyTaskService.createComment({
        comment: comment.trim(),
        status: decision,
        assetId,
      });

      if (response.success) {
        toast.success(response.message);
        setIsCommentSubmitted(true);
      } else {
        toast.error(response.message || "Failed to submit comment");
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isCommentSubmitted) {
    return (
      <div className="flex flex-col bg-white">
        <TopNav />
        <div className="flex">
          <DecisionResultCard
            type={decision}
            assetName={assetData?.name}
            version={assetData?.version}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <TopNav />

      <div className="flex flex-1 flex-col sm:flex-row">
        <section className="flex-1 overflow-y-auto border-b border-gray-200 p-4 sm:border-r sm:border-b-0 sm:p-6">
          <div className="justify-between sm:flex sm:items-start gap-4">
            <div>
              <div className="mb-4 sm:mb-6">
                <h1 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                  {assetData?.name ||
                    (isLoading ? "Loading asset..." : "Asset review")}
                </h1>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <p>
                    <span className="text-black">Description:</span>{" "}
                    {assetData?.agencyComments[0]?.message}
                  </p>
                  {/* <p>
                    <span className="text-black">Designed By:</span>{" "}
                    {assetData?.agencyComments[0]?.user.name}
                  </p> */}
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-0">
              <div className="mb-2 text-xs font-medium text-gray-600">
                Version
              </div>
              <Button className="cursor-auto rounded-sm bg-gray-500 px-2 text-sm hover:bg-gray-500 sm:px-3">
                {formatVersion(assetData?.version)}
              </Button>
            </div>
          </div>

          <div className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 sm:h-64 md:h-80">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={assetData?.name || "Asset preview"}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-xs text-gray-600">
                {isLoading ? "Loading preview..." : "No file available"}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-2 pt-3 sm:flex-row sm:pt-4">
            <Button
              onClick={handleOpenNewTab}
              disabled={!imageUrl}
              variant="outline"
            >
              Open in new tab
            </Button>
            <Button onClick={handleDownload} disabled={!imageUrl}>
              Download
            </Button>
          </div>
        </section>

        <aside className="h-auto w-full overflow-y-auto bg-white p-4 sm:h-full sm:w-80 sm:p-6 md:w-96">
          {isLoading ? (
            <span className="text-gray-500 text-sm">Loading...</span>
          ) : assetData?.status === "approved" ||
            assetData?.status === "rejected" ? (
            <div className="space-y-4">
              <div
                className={
                  assetData?.status === "approved"
                    ? "rounded border-l-4 border-green-600 bg-green-50 p-2 text-xs text-green-700 sm:p-3"
                    : "rounded border-l-4 border-red-600 bg-red-50 p-2 text-xs text-red-700 sm:p-3"
                }
              >
                {assetData?.status === "approved"
                  ? "You have approved this design."
                  : "You have requested changes for this design."}
              </div>
              <div className="space-y-2">
                {assetData.clientComments?.length ? (
                  assetData.clientComments.map((comment, index) => (
                    <div
                      key={`${assetData.version}-${index}`}
                      className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                    >
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <p className="font-medium text-gray-900">
                          {comment.user?.name || "Unknown user"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {comment.user?.role}
                        </Badge>
                      </div>
                      <p>{comment.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
                    No comments added.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-1 text-sm font-semibold text-gray-900">
                Your decision
              </div>
              <div className="mb-3 text-xs text-gray-600">
                Review the design and let the agency know.
              </div>

              <Button
                onClick={() => setDecision("approved")}
                disabled={decision === "rejected"}
                className={`mb-2 flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  decision === "approved"
                    ? "bg-green-500 text-white hover:bg-green-700"
                    : "border border-green-300 bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {decision === "approved" ? "Approved" : "Approve design"}
              </Button>

              <div className="my-2 text-center text-xs text-gray-600">or</div>

              <Button
                variant="destructive"
                onClick={() => setDecision("rejected")}
                disabled={decision === "approved"}
                className={`w-full ${
                  decision === "rejected"
                    ? "bg-red-500 text-white hover:bg-red-700"
                    : "border border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {decision === "rejected" ? "Rejected " : "Requested changes"}
              </Button>

              {decision ? (
                <div className="mt-6">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Comments
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-300 bg-gray-50 p-2 sm:p-3">
                    <Textarea
                      placeholder="Leave feedback or comment for the designer..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendComment();
                        }
                      }}
                      className="min-h-20 resize-vertical rounded border border-gray-300 bg-white p-2 text-xs font-sans focus:ring-2 focus:ring-purple-300 focus:outline-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendComment}
                        disabled={!comment.trim() || isSubmittingComment}
                      >
                        {isSubmittingComment ? "Sending..." : "Send comment"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 rounded border-l-4 border-green-600 bg-green-50 p-2 text-xs text-green-700 sm:p-3">
                Your feedback is sent directly to the design team.
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
