import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { empFormSchema } from "../../../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, UserRound, IdCardLanyard, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { agencyEmployeeService } from "../../../services/agency-employee-services";
import { HandleError } from "../../../services/handleError";

function EmployeeForm() {
  const { id } = useParams();
  const isEditMode = id !== "+";
  const [loadingUser, setLoadingUser] = useState(isEditMode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(empFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: "",
        email: "",
      });
      return;
    }

    const loadUser = async () => {
      try {
        setLoadingUser(true);
        const user = await agencyEmployeeService.getEmployeeById(id);
        form.reset({
          name: user.data.name,
          email: user.data.email,
        });
      } catch (error) {
        HandleError(error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [form, id, isEditMode]);

  async function onSubmit(data) {
    setLoading(true)
    try {
      if (isEditMode) {
        const response = await agencyEmployeeService.updateEmployee(data, id);
        if (response.success) {
          toast.success(response.message);
          navigate("/agency/employees");
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await agencyEmployeeService.createEmployee(data);
        if (response.success) {
          toast.success(response.message);
          navigate("/agency/employees");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      HandleError(error);
    }
    form.reset();
    setLoading(false)
  }

  const onDeleteEmp = async (empId) => {
    try {
      const response = await agencyEmployeeService.deleteEmployee(empId);
      if (response.success) {
        toast.success(response.message);
        navigate("/agency/employees")
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      HandleError(error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium">Employee</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex gap-3">
            <IdCardLanyard />
            {isEditMode ? "Update Employee" : "Add Employee"}
          </CardTitle>
          <CardDescription>
            {isEditMode ? "Update Employee details" : "Add Employee details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-emp"
            className="grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-emp-name">Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-emp-name"
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
                    <FieldLabel htmlFor="form-emp-email">Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="form-emp-email"
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="">
          <Button
            form="form-emp"
            className="w-full md:w-50 mr-3"
            disabled={loadingUser}
          >
            {isEditMode
              ? loading
                ? "Updating..."
                : "Update"
              : loading
                ? "Adding..."
                : "Add"}
          </Button>

          {isEditMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="text-red-500 hover:text-red-500"
                  variant="outline"
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
                  <AlertDialogTitle>Delete Employee?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this Employee.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteEmp(id)}
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
}

export default EmployeeForm;
