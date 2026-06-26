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
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { UserRound, ClipboardList, Trash2 } from "lucide-react";
import { taskFormSchema } from "../../../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
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
import { agencyTaskService } from "../../../services/agency-task-service";
import { agencyEmployeeService } from "../../../services/agency-employee-services";

const TaskForm = () => {
  const { id, pid } = useParams();
  const isEditMode = id !== "+";
  const [loadingUser, setLoadingUser] = useState(isEditMode);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      employeeId: "",
    },
  });

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await agencyEmployeeService.getEmployees();
        if (response.success) {
          setEmployees(response.data);
        } else {
          toast.error(response.message || "Error occurred fetching employees!");
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch employees");
      }
    };
    getEmployees();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: "",
        description: "",
        employeeId: "",
      });
      return;
    }

    const loadTasks = async () => {
      try {
        setLoadingUser(true);
        const task = await agencyTaskService.getTaskById(id);
        form.reset({
          name: task.data.name || "",
          description: task.data.description || "",
          employeeId: task.data.employeeId || "",
        });
      } catch (error) {
        toast.error(error.message || "Unable to load task details");
      } finally {
        setLoadingUser(false);
      }
    };

    loadTasks();
  }, [form, id, isEditMode]);

    async function onSubmit(data) {
      setLoading(true)
    try {
      if (isEditMode) {
        const response = await agencyTaskService.updateTask(data, id);
        if (response.success) {
          toast.success(response.message);
          navigate(`/agency/projects/${pid}/tasks`);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await agencyTaskService.createTask(data, pid);
        if (response.success) {
          toast.success(response.message);
          navigate(`/agency/projects/${pid}/tasks`);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
    }
        form.reset();
        setLoading(false)
  }

  const onDeleteTask = async (id) => {
    try {
      const response = await agencyTaskService.deleteTask(id);
      if (response && response.success) {
        toast.success(response.message);
        navigate(`/agency/projects/${pid}/tasks`);
      } else {
        toast.error(response?.message || "Failed to delete task");
      }
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium">Tasks</h2>
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex gap-3">
            <ClipboardList />
            {isEditMode ? "Edit Task Details" : "Add Task Details"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update your task details below"
              : "Enter your task details below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUser ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading task details...
            </div>
          ) : (
            <form
              id="form-task"
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-task-name">
                        Task Name
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="form-task-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. Logo Redesign"
                          autoComplete="off"
                          type="text"
                        />
                        <InputGroupAddon>
                          <ClipboardList />
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="employeeId"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedEmployee = employees.find(
                      (employee) => employee.id === field.value,
                    );

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Assign Employee</FieldLabel>
                        <Combobox
                          onValueChange={field.onChange}
                          value={field.value}
                          data-invalid={fieldState.invalid}
                          items={employees}
                        >
                          <ComboboxInput
                            placeholder="Select from here"
                            value={selectedEmployee?.name || ""}
                          >
                            <InputGroupAddon>
                              <UserRound />
                            </InputGroupAddon>
                          </ComboboxInput>
                          <ComboboxContent>
                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item.id} value={item.id}>
                                  {item.name}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-task-description">
                        Description(optional)
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="form-task-description"
                          placeholder="e.g. Design a minimalist logo using a blue and gold palette"
                          rows={6}
                          className="min-h-10 resize-none"
                          aria-invalid={fieldState.invalid}
                          maxLength={300}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
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
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="">
          <Button
            type="submit"
            form="form-task"
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
                  className="text-red-500 hover:text-red-500"
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
                  <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this Task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteTask(id)}
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

export default TaskForm;
