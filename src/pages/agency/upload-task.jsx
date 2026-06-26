import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Upload, Clock3, FileText, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { authServices } from "@/services/auth-services";
import { agencyTaskService } from "../../services/agency-task-service";
import { HandleError } from "../../services/handleError";
import { uploadTaskSchema } from "../../schema/schema";

const getStatusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "rejected":
      return "bg-red-600 text-white";
    case "approved":
    case "completed":
      return "bg-green-600 text-white";
    case "pending":
    case "in review":
      return "bg-yellow-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const getCommentRoleLabel = (role) => {
  switch ((role || "").toLowerCase()) {
    case "agencyadmin":
      return "Agency";
    case "employee":
      return "Employee";
    case "client":
      return "Client";
    default:
      return "User";
  }
};

const statusName = {
  pending: "Pending",
  rejected: "Rejected",
  approved: "Approved",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function UploadTask() {
  const { pid, id } = useParams();
  const [taskData, setTaskData] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true);
  const [uploadUrl, setUploadUrl] = useState("");
  const [shouldDisable, setShouldDisabled] = useState(false);
  const navigate = useNavigate();
  
  const handleSendNavigate = (publicUrl, aId) => {
     navigate(`/agency/projects/${pid}/tasks/${id}/send-url/${aId}`, {
          state: { publicUrl },
    });
  };

  const form = useForm({
    resolver: zodResolver(uploadTaskSchema),
    defaultValues: {
      name: "",
      assetLink: "",
      comment: "",
    },
  });

  const refreshTaskDetails = async () => {
    try {
      setIsLoadingTask(true);
      const response = await agencyTaskService.getTaskById(id);
      setTaskData(response.data);
    } catch (error) {
      HandleError(error);
    } finally {
      setIsLoadingTask(false);
    }
  };
  
  useEffect(() => {
    if (!id) return;
    
    const loadTaskDetails = async () => {
      try {
        const response = await agencyTaskService.getTasksDetailsById(id);
        setTaskData(response.data);
        setShouldDisabled(response.data.asset[0]?.status === "approved")
      } catch (error) {
        HandleError(error);
      } finally {
        setIsLoadingTask(false);
      }
    };

    loadTaskDetails();
  }, [id]);

  useEffect(() => {
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedFile]);

  const generateUploadUrlForFile = async (file) => {
    try {
      const response = await authServices.generateUploadUrl(
        file.name,
        file.type,
      );

      if (response.data?.uploadUrl && response.data?.fileUrl) {
        setUploadUrl(response.data.uploadUrl);
        form.setValue("assetLink", response.data.fileUrl, {
          shouldDirty: true,
          shouldValidate: true,
        });
        toast.success("File selected successfully");
      } else {
        toast.error("Failed to generate upload URL");
      }
    } catch (error) {
      setUploadUrl("");
      form.setValue("assetLink", "", { shouldValidate: true });
      HandleError(error);
    }
  };

  const handleSelectedFile = async (file) => {
    const validTypes = ["image/png", "image/jpeg", "application/pdf"];
    const maxSize = 20 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only PNG, JPG, and PDF are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds 20 MB limit.");
      return;
    }

    setUploadedFile(file);
    await generateUploadUrlForFile(file);
  };

  const removeSelectedFile = () => {
    setUploadedFile(null);
    setPreviewUrl("");
    setUploadUrl("");
    form.setValue("assetLink", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleSelectedFile(file);
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleSelectedFile(file);
    }
  };

  const onSubmit = async (data) => {
    if (!uploadedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!uploadUrl) {
      toast.error("Upload URL not ready. Please try again.");
      return;
    }

    try {
      setIsUploading(true);

      await authServices.uploadFileToS3(
        uploadUrl,
        uploadedFile,
        uploadedFile.type,
      );

      const payload = {
        name: data.name.trim(),
        assetLink: data.assetLink.trim(),
        comment: data.comment?.trim() || undefined,
      };

      const response = await agencyTaskService.uploadTask(payload, id);

      if (response.success) {
        toast.success(response.message);
        const aId = response.data.id;
        const publicUrl = response.data.publicUrl || "";
        form.reset({
          name: "",
          assetLink: "",
          comment: "",
        });
        setUploadedFile(null);
        setUploadUrl("");
        await refreshTaskDetails();
        navigate(`/agency/projects/${pid}/tasks/${id}/send-url/${aId}`, {
          state: { publicUrl },
        });
      } else {
        toast.error(response.message || "Failed to upload task");
      }
    } catch (error) {
      HandleError(error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {taskData.name ?? "Upload Task"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>
              <span className="text-black">Assigned to: </span>
              {taskData.employee || "-"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="text-black">Description: </span>
            {taskData.description || "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Upload className="p-2 bg-gray-100 rounded-lg" size={35} />
                Upload New Version
              </CardTitle>
              <CardDescription>
                Add a version name, upload the asset, and include an optional
                comment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="upload-task-form"
                className="grid gap-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-lg border-2 border-dashed p-6 text-center transition ${
                    shouldDisable
                      ? "cursor-not-allowed opacity-60 bg-gray-100 border-gray-200"
                      : isDragOver
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    id="file-input"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={shouldDisable}
                  />
                  {uploadedFile ? (
                    <div className="flex justify-around gap-3">
                      {previewUrl ? (
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <img
                            src={previewUrl}
                            alt={
                              uploadedFile?.name || "Selected upload preview"
                            }
                            className="mx-auto max-h-30 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                          <p className="text-sm font-medium text-gray-700">
                            Selected file
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {uploadedFile.name}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-col gap-3 items-start justify-center">
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">
                            {uploadedFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 20 MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={removeSelectedFile}
                        >
                          <X />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-input"
                        className="block cursor-pointer"
                    >
                      <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded border border-gray-400">
                          <Upload size={18} className="text-gray-600" />
                        </div>
                      </div>
                      <p className="mb-1 text-sm text-gray-700 sm:text-base">
                        {uploadedFile
                          ? `Selected: ${uploadedFile.name}`
                          : "Drag and drop an image or PDF"}
                      </p>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        PNG, JPG, PDF up to 20 MB
                      </p>
                    </label>
                  )}
                </div>

                <FieldGroup className="grid grid-cols-1">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-upload-task-name">
                          Version Name
                        </FieldLabel>
                        <InputGroup
                          className={`${shouldDisable ? "cursor-not-allowed" : ""}`}
                        >
                          <InputGroupInput
                            {...field}
                            disabled={shouldDisable}
                            id="form-upload-task-name"
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g. Logo with blue color"
                            autoComplete="off"
                            type="text"
                          />
                          <InputGroupAddon>
                            <FileText />
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Controller
                  name="comment"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-upload-task-comment">
                        Comment
                      </FieldLabel>
                      <InputGroup
                        className={`${shouldDisable ? "cursor-not-allowed" : ""}`}
                      >
                        <InputGroupTextarea
                          {...field}
                          id="form-upload-task-comment"
                          aria-invalid={fieldState.invalid}
                          placeholder="Add any notes for this upload"
                          rows={6}
                          className="min-h-24"
                          maxLength={300}
                          disabled={shouldDisable}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            <MessageSquare className="size-4" />
                            {field.value?.length || 0}/300 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  className={`w-full`}
                  disabled={isUploading || shouldDisable}
                >
                  {isUploading ? "Uploading..." : "Upload and generate link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="h-screen relative mx-3 overflow-y-scroll scrollbar-thin">
          <div className="sticky top-0 bg-gray-100 rounded-lg p-2">
            <h3 className="flex items-center gap-2 text-lg">
              <Clock3 size={18} />
              Version History
            </h3>
            <span className="text-sm text-gray-500">
              Previous uploads and comments for this task.
            </span>
          </div>
          <div className="flex flex-col justify-between mt-1">
            {isLoadingTask ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading version history...
              </div>
            ) : taskData?.asset?.length ? (
              [...taskData.asset].map((version) => (
                <Card
                  key={version.version}
                  className="gap-3 border ring-0 my-1 py-3 shadow-none"
                >
                  <CardContent className="space-y-3 px-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">
                          <span className="mr-2">{version.name}</span>
                          <Badge className={getStatusColor(version.status)}>
                            {statusName[version.status]}
                          </Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {`v${version.version} | ${formatDate(version.createdAt)}`}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSendNavigate(version.publicUrl, version.id)}
                      >
                        Send URL
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {version.comments?.length ? (
                        version.comments.map((comment, index) => (
                          <div
                            key={`${version.version}-${index}`}
                            className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                          >
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <p className="font-medium text-gray-900">
                                {comment.user?.name || "Unknown user"}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {getCommentRoleLabel(comment.user?.role)}
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
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No versions uploaded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
