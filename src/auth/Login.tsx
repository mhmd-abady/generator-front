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
import { useTheme } from "../hooks/useThemeColors";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { colors } = useTheme();

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
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
        p: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: `radial-gradient(circle, rgba(${hexToRgb(colors.accent)}, 0.15) 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
          border: `2px solid ${colors.border}`,
          borderRadius: "12px",
          boxShadow: `0 8px 32px 0 rgba(${hexToRgb(colors.accent)}, 0.2), 0 0 20px rgba(${hexToRgb(colors.secondary)}, 0.3)`,
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={600}
            sx={{
              background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 50%, ${colors.accent} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.5rem",
              letterSpacing: "1px",
            }}
          >
            Electric Generator Management System
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            sx={{
              color: colors.textSubtle,
              fontSize: "0.95rem",
              letterSpacing: "0.5px",
            }}
          >
            Admin & Employee Access
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                backgroundColor: "rgba(211, 47, 47, 0.1)",
                borderLeft: `4px solid ${colors.accent}`,
                color: colors.error,
              }}
            >
              {error}
            </Alert>
          )}

          <Stack component="form" spacing={2} onSubmit={onSubmit}>
            <TextField
              label="Username"
              required
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: colors.text,
                  "& fieldset": {
                    borderColor: colors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: colors.accentLight,
                    boxShadow: `0 0 8px ${colors.accent}80`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.accentLight,
                    boxShadow: `0 0 12px ${colors.secondary}99`,
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.placeholder,
                  opacity: 0.7,
                },
                "& .MuiInputLabel-root": {
                  color: colors.labelText,
                  "&.Mui-focused": {
                    color: colors.accent,
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: colors.text,
                  "& fieldset": {
                    borderColor: colors.border,
                  },
                  "&:hover fieldset": {
                    borderColor: colors.accentLight,
                    boxShadow: `0 0 8px ${colors.accent}80`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.accentLight,
                    boxShadow: `0 0 12px ${colors.secondary}99`,
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.placeholder,
                  opacity: 0.7,
                },
                "& .MuiInputLabel-root": {
                  color: colors.labelText,
                  "&.Mui-focused": {
                    color: colors.accent,
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                height: 44,
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 50%, ${colors.accent} 100%)`,
                color: colors.primary,
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                boxShadow: `0 4px 15px ${colors.accent}66`,
                "&:hover:not(:disabled)": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 25px ${colors.secondary}99, 0 4px 15px ${colors.accent}99`,
                  background: `linear-gradient(135deg, ${colors.accentLight} 0%, ${colors.text} 50%, ${colors.accentLight} 100%)`,
                },
                "&:disabled": {
                  background: `${colors.accent}80`,
                  color: `${colors.primary}80`,
                },
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
}

