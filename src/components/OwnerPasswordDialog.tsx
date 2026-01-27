import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";

const OWNER_PASSWORD = "1234"; // TEMP

export default function OwnerPasswordDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const confirm = () => {
    if (password === OWNER_PASSWORD) {
      setPassword("");
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Owner Access</DialogTitle>

      <DialogContent>
        <TextField
          type="password"
          label="Enter Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          helperText={error ? "Wrong password" : ""}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={confirm}>
          Unlock
        </Button>
      </DialogActions>
    </Dialog>
  );
}
