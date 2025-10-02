import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/hooks/use-toast";
import useStore from "@/store";
import { token } from "@/atoms/kuepa";
import { leadService } from "@/services/leadService";
import { app } from "@/atoms/kuepa";

const validationSchema = Yup.object({
  first_name: Yup.string().required("Nombre es requerido"),
  last_name: Yup.string().required("Apellido es requerido"),
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  mobile_phone: Yup.string().required("Teléfono es requerido"),
  interestProgram: Yup.string().required("Programa de interés es requerido"),
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Estado es requerido"),
});

type LeadFormValues = Yup.InferType<typeof validationSchema>;

const LeadsTable = () => {
  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "green",
      breadcrumb: [
        {
          title: "Leads",
          url: "/leads",
        },
      ],
    });
  }, []);

  const { leads, fetchLeads, deleteLead, programs, trackings } = useStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {
    if (leads.length === 0) {
      fetchLeads();
    }
  }, [leads.length, fetchLeads]);

  const getProgramName = (programId: string) => {
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : "N/A";
  };

  const handleDelete = (id: string) => {
    setSelectedLead(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedLead) {
      const response = await deleteLead(selectedLead);
      if (response?.code === 200) {
        toast({
          title: "Éxito",
          description: "Lead eliminado correctamente",
          className: "bg-green-500 text-white",
        });
        localStorage.removeItem(`${"kuepa"}:cache:get/lead:${token.get()}`);
        fetchLeads();
        setDeleteDialogOpen(false);
        setSelectedLead(null);
      }
    }
  };

  const handleEditSubmit = async (values: LeadFormValues) => {
    const response = await leadService.create({
      _id: selectedLead._id,
      ...values,
    });

    if (response?.code === 200) {
      toast({
        title: "Éxito",
        description: "Lead actualizado correctamente",
        className: "bg-green-500 text-white",
      });
      localStorage.removeItem(`${"kuepa"}:cache:get/lead:${token.get()}`);
      fetchLeads();
      setEditDialogOpen(false);
      setSelectedLead(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Programa</TableHead>
            <TableHead>Seguimientos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell>{lead.first_name}</TableCell>
              <TableCell>{lead.last_name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.mobile_phone}</TableCell>
              <TableCell>{getProgramName(lead.interestProgram)}</TableCell>
              <TableCell>
                {lead.trackings
                  ?.map((t) => {
                    const tracking = trackings.find(
                      (tr) => tr._id === t.tracking
                    );
                    return `${tracking?.name || "N/A"}: ${t.description}`;
                  })
                  .join(", ") || "Ninguno"}
              </TableCell>
              <TableCell>
                {lead.status === "active" ? "Activo" : "Inactivo"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(lead)}
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(lead._id)}
                    variant="destructive"
                    size="sm"
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de eliminación existente */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro de que quieres eliminar este lead? Esta acción no se
            puede deshacer.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nuevo modal de edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <Formik<LeadFormValues>
              initialValues={{
                first_name: selectedLead.first_name || "",
                last_name: selectedLead.last_name || "",
                email: selectedLead.email || "",
                mobile_phone: selectedLead.mobile_phone || "",
                interestProgram: selectedLead.interestProgram || "",
                status: selectedLead.status || "active",
              }}
              validationSchema={validationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Nombre</Label>
                      <Field name="first_name">
                        {({ field }: { field: any }) => (
                          <Input {...field} id="first_name" />
                        )}
                      </Field>
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Apellido</Label>
                      <Field name="last_name">
                        {({ field }: { field: any }) => (
                          <Input {...field} id="last_name" />
                        )}
                      </Field>
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Field name="email">
                      {({ field }: { field: any }) => (
                        <Input {...field} id="email" type="email" />
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile_phone">Teléfono Móvil</Label>
                    <Field name="mobile_phone">
                      {({ field }: { field: any }) => (
                        <Input {...field} id="mobile_phone" />
                      )}
                    </Field>
                    <ErrorMessage
                      name="mobile_phone"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestProgram">Programa de Interés</Label>
                    <Select
                      value={values.interestProgram}
                      onValueChange={(value) =>
                        setFieldValue("interestProgram", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar programa" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program._id} value={program._id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="interestProgram"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </Button>
                  </DialogFooter>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsTable;
