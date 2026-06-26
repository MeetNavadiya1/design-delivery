import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, User, Camera, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { registerSchema } from "@/schema/auth-schema";
import { authServices } from "../../services/auth-services";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [preview, setPreview] = useState("");
  const [, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(""); // state to store the S3 URL

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only PNG, and  JPG are allowed.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(`File size must be less than 2MB.`);
      return;
    }

    setAvatarFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    try {
      // Get pre-signed upload URL
      const generateRes = await authServices.generateUploadUrl(
        file.name,
        file.type,
        file.size,
      );
      const { uploadUrl, fileUrl } = generateRes.data;

      if (!uploadUrl || !fileUrl) {
        throw new Error("Failed to get upload URL");
      }
      //Upload file directly to S3
      await authServices.uploadFileToS3(uploadUrl, file, file.type);

      //Store avatar URL in state
      setAvatarUrl(fileUrl);
    } catch (error) {
      const errorMessage =
        error?.message || "Failed to upload profile picture. Please try again.";
      toast.error(errorMessage);
      setPreview(null);
      e.target.value = "";
    }
  };
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleRemoveAvatar = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setAvatarFile(null);
    setAvatarUrl(""); // clear the URL as well
  };

  async function onSubmit(data) {
    try {
      const payload = {
        email: data.email,
      };

      const response = await authServices.registerUser(payload);
      toast.success(response?.message || "OTP sent successfully");

      navigate("/verify-otp", {
        state: {
          email: data.email,
          avatar: avatarUrl,
          name: data.name,
          password: data.password,
        },
      });
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  }

  return (
    <form
      id="form-register"
      className="grid gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center">
        <div className="relative mx-auto flex">
          <label className="cursor-pointer flex">
            <Avatar className="h-18 w-18 border-2 border-dashed border-primary">
              <AvatarImage src={preview} className="p-1" />

              <AvatarFallback>
                <Camera size={28} className="text-primary" />
              </AvatarFallback>
            </Avatar>
            <input
              key={preview ? "has-avatar" : "no-avatar"}
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </label>
          {preview && (
            <button
              type="button"
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors flex items-center justify-center h-6 w-6"
              onClick={handleRemoveAvatar}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="mt-1  text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-xs text-primary hover:text-hover-primary whitespace-nowrap"
          >
            Set profile picture
          </button>
        </div>
      </div>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-name">Name</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-register-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Your Name"
                  autoComplete="name"
                  type="text"
                />
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-register-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Email"
                  autoComplete="email"
                  type="email"
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-register-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                  align="inline-end"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-register-confirm-password">
                Confirm Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-register-confirm-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Confirm Password"
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon
                  onClick={() => setConfirmPassword((prev) => !prev)}
                  className="cursor-pointer"
                  align="inline-end"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button className="w-full mt-1" type="submit" size="lg">
        Register
      </Button>

      <p className="text-center">
        Already have an account?{" "}
        <Link
          to="/"
          className="cursor-pointer text-primary font-medium hover:text-primary/90 transition-colors duration-300 hover:underline underline-offset-2"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
