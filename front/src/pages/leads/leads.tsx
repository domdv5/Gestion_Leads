import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

import { app } from "@/atoms/kuepa";
import useStore from "@/store";
import { leadService } from "@/services/leadService";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { token } from "@/atoms/kuepa";

const validationSchema = Yup.object({
  first_name: Yup.string().required("Nombre es requerido"),
  last_name: Yup.string().required("Apellido es requerido"),
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  mobile_phone: Yup.string().required("Teléfono es requerido"),
  interestProgram: Yup.string().required("Programa de interés es requerido"),
  status: Yup.string()
    .oneOf(["active", "inactive"])
    .required("Estado es requerido"),
  trackings: Yup.array(
    Yup.object({
      tracking: Yup.string().required("Seguimiento es requerido"),
      description: Yup.string().required("Descripción es requerida"),
    })
  )
    .min(1, "Debe agregar al menos un seguimiento")
    .required("Debe agregar al menos un seguimiento"),
});

type LeadFormValues = Yup.InferType<typeof validationSchema>;

export default function Leads() {
  const { programs, fetchPrograms, trackings, fetchTrackings } = useStore();

  const [selectedTracking, setSelectedTracking] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (programs.length === 0) {
      fetchPrograms();
    }
    if (trackings?.length === 0) {
      fetchTrackings();
    }
  }, [programs.length, fetchPrograms, trackings?.length, fetchTrackings]);

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "purple",
      breadcrumb: [
        {
          title: "Leads",
          url: "/leads",
        },
      ],
    });
  }, []);

  const initialValues: LeadFormValues = {
    first_name: "",
    last_name: "",
    email: "",
    mobile_phone: "",
    interestProgram: "",
    status: "active",
    trackings: [],
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="flex text-4xl font-bold text-purple-800 mb-6">Leads</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Crear Nuevo Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik<LeadFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              const data = {
                ...values,
                full_name: `${values.first_name} ${values.last_name}`.trim(),
              };
              const response = await leadService.create(data);

              if (response.code === 200) {
                toast({
                  title: "Prospecto Creado",
                  description: "Se guardó correctamente en la base de datos",
                  className: "bg-green-500 text-white",
                });
                localStorage.removeItem(
                  `${"kuepa"}:cache:get/lead:${token.get()}`
                );
              }

              if (response.code === 400) {
                toast({
                  title: "Error",
                  description: "El email ya está registrado",
                  className: "bg-red-500 text-white",
                });
              }

              if (response.code !== 200 && response.code !== 400) {
                toast({
                  title: "Error",
                  description: response.message || "Error del servidor",
                  className: "bg-red-500 text-white",
                });
              }

              resetForm();
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre */}
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
                  {/* Apellido */}
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
                {/* Email */}
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
                {/* Teléfono Móvil */}
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
                {/* Programa de Interés */}
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
                {/* Estado */}
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
                {/* Seguimientos (Trackings) */}
                <FieldArray name="trackings">
                  {({ push, remove }) => {
                    const addTracking = () => {
                      if (selectedTracking && description.trim()) {
                        push({
                          tracking: selectedTracking,
                          description: description.trim(),
                        });
                        setSelectedTracking("");
                        setDescription("");
                      }
                    };

                    return (
                      <div>
                        <Label>Seguimientos</Label>
                        <ErrorMessage
                          name="trackings"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 mb-4 mt-2">
                          <Select
                            value={selectedTracking}
                            onValueChange={setSelectedTracking}
                          >
                            <SelectTrigger className="w-full sm:w-1/2">
                              <SelectValue placeholder="Seleccionar seguimiento" />
                            </SelectTrigger>
                            <SelectContent>
                              {trackings?.map((tracking) => (
                                <SelectItem
                                  key={tracking._id}
                                  value={tracking._id}
                                >
                                  {tracking.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Descripción"
                            value={description}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setDescription(e.target.value)}
                            className="w-full sm:w-1/2"
                          />
                          <Button
                            type="button"
                            onClick={addTracking}
                            variant="outline"
                          >
                            Agregar
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {values.trackings?.map((t, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border border-gray-200"
                            >
                              <span className="text-sm text-gray-700">
                                <strong className="text-purple-700">
                                  {
                                    trackings?.find(
                                      (tr) => tr._id === t.tracking
                                    )?.name
                                  }
                                </strong>
                                : {t.description}
                              </span>
                              <Button
                                type="button"
                                onClick={() => remove(index)}
                                variant="destructive"
                                size="sm"
                              >
                                Remover
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                </FieldArray>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 font-semibold py-2 mt-6"
                >
                  {isSubmitting ? "Creando..." : "Crear Lead"}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
