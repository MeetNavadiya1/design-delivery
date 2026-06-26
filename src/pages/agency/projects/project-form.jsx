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
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { SquareChartGantt, UserRound, FolderPen, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectSchema } from "../../../schema/schema";
import { agencyProjectService } from "../../../services/agency-project-services";
import { agencyClientServices } from "../../../services/agency-client-service";
import { HandleError } from "../../../services/handleError";

const ProjectForm = () => {
  const { id } = useParams();
  const isEditMode = id !== "+";
  const [loadingProject, setLoadingProject] = useState(isEditMode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      clientId: "",
    },
  });

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await agencyClientServices.getClients();
        if (response.success) {
          setClients(response.data);
        } else {
          toast.error(response.message || "Error occurred fetching clients!");
        }
      } catch (error) {
        HandleError(error);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      form.reset({
        name: "",
        clientId: "",
      });
      return;
    }

    const loadProject = async () => {
      try {
        setLoadingProject(true);
        const project = await agencyProjectService.getProjectById(id);
        form.reset({
          name: project.data.name,
          clientId: project.data.clientId,
        });
      } catch (error) {
        HandleError(error);
      } finally {
        setLoadingProject(false);
      }
    };

    loadProject();
  }, [form, id, isEditMode]);

  async function onSubmit(data) {
    setLoading(true);
    try {
      if (isEditMode) {
        const response = await agencyProjectService.updateProject(data, id);
        if (response.success) {
          toast.success(response.message);
          navigate("/agency/projects");
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await agencyProjectService.createProject(data);
        if (response.success) {
          toast.success(response.message);
          navigate("/agency/projects");
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      HandleError(error);
    }
    form.reset();
    setLoading(false);
  }

  const onDeleteProject = async (projectId) => {
    try {
      const response = await agencyProjectService.deleteProject(projectId);
      if (response.success) {
        toast.success(response.message);
        navigate("/agency/projects");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      HandleError(error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium">Project</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex gap-3">
            <SquareChartGantt />
            {isEditMode ? "Edit Project Details" : "Add Project Details"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Update your project details below"
              : "Enter your project details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingProject ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading project details...
            </div>
          ) : (
            <form
              id="form-project"
              className="grid gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-project-name">
                        Project Name
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <FolderPen />
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          id="form-project-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.g. Mobile App Redesign"
                          autoComplete="off"
                          type="text"
                        />
                      </InputGroup>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="clientId"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const selectedClient = clients.find(
                      (client) => client.id === field.value,
                    );

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-project-client">
                          Client
                        </FieldLabel>
                        <Combobox
                          items={clients}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <ComboboxInput
                            placeholder="Select form here"
                            value={selectedClient?.name}
                          >
                            <InputGroupAddon align="inline-start">
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
            </form>
          )}
        </CardContent>
        <CardFooter className="">
          <Button
            form="form-project"
            className="w-full md:w-50 mr-3"
            disabled={loadingProject}
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
                  <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this Project.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDeleteProject(id)}
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

export default ProjectForm;
