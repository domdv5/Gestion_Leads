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

const TrackingTable = () => {
  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: "kuepa",
      module: "leads",
      window: "crm",
      back: null,
      accent: "slate",
      breadcrumb: [
        {
          title: "Trackings",
          url: "/trackings",
        },
      ],
    });
  }, []);

  const { trackings, fetchTrackings } = useStore();

  useEffect(() => {
    if (trackings.length === 0) {
      fetchTrackings();
    }
  }, [trackings.length, fetchTrackings]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripcion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trackings.map((item) => (
          <TableRow key={item._id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrackingTable;
