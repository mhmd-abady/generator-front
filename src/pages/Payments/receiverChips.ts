import type { ChipProps } from "@mui/material";

export type ReceiverRole = "ADMIN" | "EMPLOYEE" | "COLLECTOR" | string;

export const receiverRoleColor = (role?: ReceiverRole): ChipProps["color"] => {
  if (!role) return "default";
  switch (role) {
    case "ADMIN":
      return "info";
    case "COLLECTOR":
      return "success";
    case "EMPLOYEE":
      return "warning";
    default:
      return "default";
  }
};

export const receiverChipSx = {
  borderRadius: "8px",
  justifyContent: "center",
  fontWeight: 600,
  "& .MuiChip-label": {
    fontWeight: 600,
  },
} as const;
