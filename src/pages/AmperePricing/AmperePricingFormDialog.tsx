import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { AmperePricing } from "../../api/ampere-pricing";

type Props = {
  open: boolean;
  editing?: AmperePricing | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    ampere: number;
    price: number;
    isActive: boolean;
  }) => void;
};

export default function AmperePricingFormDialog({
  open,
  editing,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [ampere, setAmpere] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setAmpere(editing?.ampere ?? 0);
    setPrice(editing?.price ?? 0);
    setIsActive(editing?.isActive ?? true);
  }, [open, editing]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{editing ? "Edit Ampere Pricing" : "Add Ampere Pricing"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Ampere"
            type="number"
            value={ampere}
            onChange={(e) => setAmpere(Number(e.target.value))}
            inputProps={{ min: 1 }}
            fullWidth
          />

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            inputProps={{ min: 0, step: "0.01" }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={loading || ampere <= 0 || price < 0}
          onClick={() => onSubmit({ ampere, price, isActive })}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

