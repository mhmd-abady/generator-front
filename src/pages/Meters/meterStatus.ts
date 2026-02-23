import type { ChipProps } from "@mui/material";
import type { MeterStatus } from "../../api/meters";

export const meterStatusColor = (
  status?: MeterStatus
): ChipProps["color"] => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "INACTIVE":
      return "warning";
    case "BROKEN":
    case "REPLACED":
    case "DISCONNECTED":
      return "error";
    default:
      return "default";
  }
};

export const meterStatusChipSx = {
  borderRadius: "6px",
  justifyContent: "center",
  px: 1.5,
  height: 26,
  width: "fit-content",
} as const;
