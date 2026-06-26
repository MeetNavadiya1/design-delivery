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
import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPasswordSchema } from "@/schema/auth-schema";
import { authServices } from "../../services/auth-services";
import { toast } from "sonner";

const ForgotPasswordForm = () => {

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const { isSubmitSuccessful } = form.formState;
    const emailValue = useWatch({
        control: form.control,
        name: "email",
    });

    function maskEmail(email = "") {
        const [name, domain] = email.split("@");

        const visiblePart = name.slice(0, 2);

        const maskedPart = "*".repeat(
            Math.max(name.length - 2, 0)
        );

        return `${visiblePart}${maskedPart}@${domain}`;
    }


    if (isSubmitSuccessful) {
        return (
            <div className="w-full text-center">
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm mb-5">
                    <p className="text-sm text-center text-muted-foreground">
                        Reset link sent to{" "}
                        <span className="font-medium text-primary">
                            {maskEmail(emailValue)}
                        </span>
                        . Check your inbox.
                    </p>
                </div>
                <Link
                    to="/"
                    className="text-primary hover:text-hover-primary inline-flex items-center justify-center text-sm font-semibold"
                >
                    <ArrowLeft className="w-4 mr-1" />
                    Back to login
                </Link>
            </div>
        );
    }

    async function onSubmit(data) {
        try {
            const response = await authServices.forgotPasswordUser(data);
            toast.success(response?.message || "Password reset email sent successfully");
        } catch (error) {
            toast.error(error?.message || "Failed to send reset email");
        }
    }

    return (
        <form
            id="form-forgot-password"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FieldGroup>
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="form-forgot-password-email">Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    id="form-forgot-password-email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter Email"
                                    autoComplete="email"
                                    type="email"
                                />
                                <InputGroupAddon>
                                    <Mail />
                                </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button className="w-full mt-3" type="submit" size="lg">
                Send Reset Link
            </Button>

            <Link to="/" className=" inline-flex items-center justify-center gap-1 text-center cursor-pointer text-primary font-medium hover:text-primary/90 transition-colors duration-300 hover:underline underline-offset-2"><ArrowLeft size={18} /> Back to Sign in</Link>
        </form>
    );
};

export default ForgotPasswordForm;
