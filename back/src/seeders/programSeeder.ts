import { ProgramModel } from "@app/models/programModel";
import { IConsole } from "@client/client";

export const run = async (_params, console: IConsole) => {
  try {
    const programs = [
      {
        name: "Programa de Ingeniería de Software",
        description:
          "Un programa completo para formar ingenieros de software con habilidades en desarrollo, diseño y gestión de proyectos.",
      },
      {
        name: "Programa de Diseño Gráfico",
        description:
          "Aprende a crear diseños visuales impactantes utilizando herramientas modernas y técnicas creativas.",
      },
      {
        name: "Programa de Marketing Digital",
        description:
          "Domina las estrategias de marketing en línea, SEO, redes sociales y análisis de datos.",
      },
      {
        name: "Programa de Administración de Empresas",
        description:
          "Desarrolla habilidades en gestión empresarial, finanzas, recursos humanos y estrategia.",
      },
      {
        name: "Programa de Idiomas",
        description:
          "Mejora tus habilidades lingüísticas en inglés, español y otros idiomas con métodos interactivos.",
      },
    ];

    for (const program of programs) {
      await ProgramModel.findOneAndUpdate({ name: program.name }, program, {
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
