import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

interface HierarchyDialogProps {
  open: boolean;
  type: "region" | "neighborhood" | "box";
  title: string;
  subtitle?: string;
  label: string;
  value: string;
  isEditing: boolean;
  onValueChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function HierarchyDialog({
  open,
  type,
  title,
  subtitle,
  label,
  value,
  isEditing,
  onValueChange,
  onClose,
  onSubmit,
}: HierarchyDialogProps) {
  const { colors, getBorderRadius } = useTheme();

  const getTypeConfig = () => {
    switch (type) {
      case "region":
        return {
          gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
          borderColor: `${colors.accent}30`,
          icon: "🌍",
        };
      case "neighborhood":
        return {
          gradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent} 50%, ${colors.primary} 100%)`,
          borderColor: `${colors.secondary}30`,
          icon: "🏘️",
        };
      case "box":
        return {
          gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
          borderColor: `${colors.primary}30`,
          icon: "📦",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={type === "box" ? "xs" : "sm"}
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(145deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
          border: `1px solid ${config.borderColor}`,
          borderRadius: getBorderRadius("large"),
          boxShadow: `0 20px 60px ${colors.primary}20, 0 8px 24px ${config.borderColor}40`,
          backdropFilter: "blur(20px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              type === "region"
                ? `linear-gradient(90deg, ${colors.accent}, ${colors.secondary}, ${colors.primary})`
                : type === "neighborhood"
                ? `linear-gradient(90deg, ${colors.secondary}, ${colors.accent}, ${colors.primary})`
                : `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: config.gradient,
          color: colors.text,
          fontWeight: 700,
          fontSize: "1.5rem",
          py: 3,
          textAlign: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "2px",
            background: colors.text,
            opacity: 0.3,
            borderRadius: "1px",
          },
        }}
      >
        <span>{config.icon}</span>
        <span>{title}</span>
      </DialogTitle>

      {/* Subtitle */}
      {subtitle && (
        <Box
          sx={{
            px: 4,
            pt: 3,
            pb: 1,
            background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.secondary}05 100%)`,
            borderBottom: `1px solid ${config.borderColor}`,
          }}
        >
          <Box
            component="p"
            sx={{
              color: colors.textSubtle,
              fontSize: "0.9rem",
              fontWeight: 500,
              margin: 0,
              opacity: 0.8,
            }}
          >
            {subtitle}
          </Box>
        </Box>
      )}

      {/* Content */}
      <DialogContent
        sx={{
          p: 5,
          pb: 2,
          mt: 3,
          mb:3,
          background: "transparent",
        }}
      >
        <TextField
          label={label}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          fullWidth
          autoFocus
          variant="outlined"
          placeholder={`Enter ${label.toLowerCase()}`}
          sx={{
            "& .MuiOutlinedInput-root": {
              background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.secondary}05 100%)`,
              color: colors.text,
              borderRadius: getBorderRadius("large"),
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "& fieldset": {
                borderColor: colors.border,
                borderWidth: "2px",
              },
              "&:hover fieldset": {
                borderColor: colors.accentLight,
                boxShadow: `0 0 0 3px ${colors.accent}20`,
              },
              "&.Mui-focused fieldset": {
                borderColor: colors.accent,
                borderWidth: "2px",
                boxShadow: `0 0 0 4px ${colors.accent}25`,
              },
              "&.Mui-focused": {
                background: `linear-gradient(135deg, ${colors.primary}12 0%, ${colors.secondary}08 100%)`,
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.labelText,
              fontWeight: 500,
              "&.Mui-focused": {
                color: colors.accent,
                fontWeight: 600,
              },
            },
            "& .MuiOutlinedInput-input": {
              fontSize: "1rem",
              fontWeight: 500,
              padding: "12px 16px",
              "&::placeholder": {
                color: colors.placeholder,
                opacity: 0.6,
              },
            },
          }}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          gap: 2,
          justifyContent: "center",
          background: `linear-gradient(180deg, transparent 0%, ${colors.primary}05 100%)`,
          borderTop: `1px solid ${config.borderColor}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: colors.textSubtle,
            border: `2px solid ${colors.border}`,
            borderRadius: getBorderRadius("large"),
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: `linear-gradient(135deg, ${colors.textSubtle}15 0%, ${colors.textSubtle}08 100%)`,
              borderColor: colors.textSubtle,
              transform: "translateY(-2px)",
              boxShadow: `0 6px 20px ${colors.textSubtle}30`,
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{
            background: config.gradient,
            color: colors.text,
            border: `2px solid ${colors.accent}`,
            borderRadius: getBorderRadius("large"),
            fontWeight: 700,
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            boxShadow: `0 4px 16px ${colors.accent}40`,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-2px) scale(1.02)",
              boxShadow: `0 8px 24px ${colors.accent}50`,
            },
            "&:active": {
              transform: "translateY(0) scale(0.98)",
            },
            "&:disabled": {
              background: `linear-gradient(135deg, ${colors.disabled} 0%, ${colors.disabled}80 100%)`,
              color: colors.disabledText,
              border: `2px solid ${colors.disabled}`,
              boxShadow: `0 2px 8px ${colors.disabled}30`,
              opacity: 0.7,
              cursor: "not-allowed",
            },
          }}
        >
          {isEditing ? "✏️ Update" : "➕ Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
