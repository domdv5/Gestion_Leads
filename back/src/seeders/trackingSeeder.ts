import { TrackingModel } from "@app/models/trackingModel";
import { IConsole } from "@client/client";

export const run = async (_params, console: IConsole) => {
  try {
    const trackings = [
      {
        name: "Lead Creado",
        description:
          "Evento de seguimiento cuando un nuevo lead se registra en el sistema.",
      },
      {
        name: "Correo Enviado",
        description: "Seguimiento cuando se envía un correo a un lead.",
      },
      {
        name: "Lead Contactado",
        description:
          "Seguimiento cuando un lead es contactado por primera vez por el equipo.",
      },
      {
        name: "Lead Convertido",
        description:
          "Seguimiento cuando un lead se convierte en cliente o matrícula.",
      },
      {
        name: "Interacción de Campaña",
        description: "Seguimiento de interacciones con campañas de marketing.",
      },
    ];

    for (const tracking of trackings) {
      await TrackingModel.findOneAndUpdate({ name: tracking.name }, tracking, {
        upsert: true,
        new: true,
      });
    }
  } catch (error) {
    console.log("error", error);
    return false;
  }
  return true;
};
