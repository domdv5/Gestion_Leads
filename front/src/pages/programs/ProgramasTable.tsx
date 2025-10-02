import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useStore from "@/store";
import { app } from "@/atoms/kuepa";

const ProgramsTable = () => {
  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "rose",
      breadcrumb: [
        {
          title: "Programs",
          url: "/programs",
        },
      ],
    });
  }, []);
  const { programs, fetchPrograms } = useStore();

  useEffect(() => {
    if (programs.length === 0) {
      fetchPrograms();
    }
  }, [programs.length, fetchPrograms]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripcion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programs.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProgramsTable;
