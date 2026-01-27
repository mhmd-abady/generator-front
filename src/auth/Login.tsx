import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginApi } from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

   try {
      const data = await loginApi(username, password);

      localStorage.setItem("refreshToken", data.refreshToken);

      login(data.accessToken, {
        id: data.user.id,
        role: data.user.role,
        username: data.user.username,
      });

      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", bgcolor: "#f4f6f8", p: 2 }}
    >
      <Paper
        elevation={3}
        sx={{ p: 4, width: "100%", maxWidth: 420 }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
          >
            Electric Generator Management System
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
          >
            Admin & Employee Access
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              label="Username"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ height: 44 }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
