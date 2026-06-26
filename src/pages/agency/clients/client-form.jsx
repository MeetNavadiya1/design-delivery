import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/input-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Mail, UserRound, UserRoundPlus, Phone, Trash2 } from "lucide-react";
import { clientFormSchema } from "../../../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parsePhoneNumberFromString, { AsYouType } from "libphonenumber-js";
import { agencyClientServices } from "../../../services/agency-client-service";
import { HandleError } from "../../../services/handleError";

const ClientForm = () => {
  const { id } = useParams();
  const isEditMode = id !== "+";
  const [loadingUser, setLoadingUser] = useState(isEditMode);
  const [displayPhone, setDisplayPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const formatter = new AsYouType("IN");
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: "",
        email: "",
        phone: "",
      });
      return;
    }

    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const user = await agencyClientServices.getClientById(id);
        form.reset({
          name: user.data.name,
          email: user.data.email,
          phone: user.data.mobileNumber,
        });
        setDisplayPhone(
          parsePhoneNumberFromString(user.data.mobileNumber, "IN")
            ?.formatNational()
            .slice(1),
        );
      } catch (error) {
        HandleError(error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [form, id, isEditMode]);

  const clearForm = () => {
    form.reset({ name: "", email: "", phone: "" });
    setDisplayPhone("");
  };

  async function onSubmit(data) {
    setLoading(true);
    try {
      if (isEditMode) {
        const response = await agencyClientServices.updateClient(data, id);

        if (response.success) {
          toast.success(response.message);
          clearForm();
          navigate("/agency/clients");
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await agencyClientServices.createClient(data);
        if (response.success) {
          toast.success(response.message);
          clearForm();
          navigate("/agency/clients");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      const message = error?.message;
      clearForm();
      toast.error(message);
    }
    setLoading(false);
  }

  const onDeleteClient = async (clientId) => {
    try {
      const response = await agencyClientServices.deleteClient(clientId);
      if (response.success) {
        toast.success("Client deleted successfully");
        navigate("/agency/clients")
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      HandleError(error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium">Clients</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex gap-3">
            <UserRoundPlus />
            {isEditMode ? "Edit Client" : "Add Client"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update your client details"
              : "Enter your client details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUser ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading client details....
            </div>
          ) : (
            <form
              id="form-client"
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-client-name">Name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="form-client-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. John Doe"
                          autoComplete="off"
                          type="text"
                        />
                        <InputGroupAddon>
                          <UserRound />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-client-email">Email</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="form-client-email"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. johndoe@gmail.com"
                          autoComplete="off"
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

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-client-phone">
                          WhatsApp Number
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            value={displayPhone}
                            id="form-client-phone"
                            aria-invalid={fieldState.invalid}
                            placeholder="e.g. 9878655468"
                            autoComplete="off"
                            type="tel"
                            maxLength="11"
                            onChange={(e) => {
                              const formatted = formatter.input(e.target.value);
                              setDisplayPhone(formatted);
                              field.onChange(
                                formatter.getNumberValue().slice(3) || "",
                              );
                            }}
                          />
                          <InputGroupAddon>
                            <Phone />
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="">
          <Button
            form="form-client"
            className="w-full md:w-50 mr-3"
            disabled={loadingUser}
          >
            {isEditMode
              ? loading
                ? "Updating..."
                : "Update"
              : loading
                ? "Creating..."
                : "Create"}
          </Button>

          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red"
                >
                  <Trash2
                    size="18"
                    className="text-red-500 hover:cursor-pointer"
                  />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2 />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Client?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this Client.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteClient(id)}
                  >
                    Confirm Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ClientForm;
