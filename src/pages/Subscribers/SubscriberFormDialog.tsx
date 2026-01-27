import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import type {
  CreateSubscriberDto,
  Subscriber,
} from "../../api/subscribers";

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialData?: Subscriber | null;
  onClose: () => void;
  onSubmit: (dto: CreateSubscriberDto) => void;
};

export default function SubscriberFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateSubscriberDto>({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        fullName: initialData.fullName,
        phone: initialData.phone,
        address: initialData.address ?? "",
      });
    }

    if (mode === "create") {
      setForm({ fullName: "", phone: "", address: "" });
    }
  }, [mode, initialData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Add Subscriber" : "Edit Subscriber"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Full Name"
            required
            value={form.fullName}
            onChange={(e) =>
              setForm({ ...form, fullName: e.target.value })
            }
          />

          <TextField
            label="Phone"
            required
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <TextField
            label="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSubmit(form)}
        >
          {mode === "create" ? "Create" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
