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
import { Lock, Eye, EyeOff, RotateCcw, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
import { toast } from "sonner";
import { resetPasswordSchema } from "../../schema/auth-schema";
import { authServices } from "../../services/auth-services";

const ResetPasswordForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });


    const onSubmit = async (data) => {
        try {
            const payload = {
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            };
            const res = await authServices.resetPassword(payload);
            toast.success(res?.message || "Password updated successfully");
            navigate("/");
        } catch (error) {
            toast.error(error?.message || "Failed to reset password");
        }
    }

    return (
        <form
            id="form-reset-password"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
        >

            <FieldGroup>

                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-reset-password-password">
                                New Password
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id="form-reset-password-password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter New Password"
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
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-reset-password-confirm-password">
                                Confirm Password
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id="form-reset-password-confirm-password"
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
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button className="w-full mt-3" type="submit" size="lg" >
                <RotateCcw size={16} /> Reset Password
            </Button>

            <Link to="/" className=" inline-flex items-center justify-center gap-1 text-center cursor-pointer text-primary font-medium hover:text-primary/90 transition-colors duration-300 hover:underline underline-offset-2"><ArrowLeft size={18} />back to Login</Link>
        </form>
    );
};

export default ResetPasswordForm;
