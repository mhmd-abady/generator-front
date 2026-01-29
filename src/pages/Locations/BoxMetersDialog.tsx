import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
} from "@mui/material";
import { useBoxMeters } from "../../hooks/useBoxMeters";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  box: { id: number; code: string };
  open: boolean;
  onClose: () => void;
};

export default function BoxMetersDialog({ box, open, onClose }: Props) {
  const { colors, getShadow, getBorderRadius, getResponsiveSpacing } = useTheme();
  const { data, isLoading } = useBoxMeters(box.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.darker} 100%)`,
          border: `1px solid ${colors.accent}40`,
          borderRadius: getBorderRadius('large'),
          boxShadow: getShadow('strong'),
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          color: colors.accent,
          fontWeight: 700,
          fontSize: "1.25rem",
          borderBottom: `1px solid ${colors.accent}30`,
          mb: 2,
          textAlign: "center",
        }}
      >
        Meters — Box {box.code}
      </DialogTitle>

      <DialogContent sx={{ p: getResponsiveSpacing(2) }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: colors.textSubtle,
                fontStyle: "italic",
              }}
            >
              Loading meters...
            </Typography>
          </Box>
        ) : !data || data.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              color: colors.textSubtle,
              fontStyle: "italic",
            }}
          >
            <Typography variant="body1">
              No meters in this box
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      background: `${colors.accent}10`,
                      color: colors.accent,
                      fontWeight: 600,
                      borderBottom: `2px solid ${colors.accent}30`,
                      fontSize: "0.9rem",
                      textAlign: "center",
                    },
                  }}
                >
                  <TableCell>Meter</TableCell>
                  <TableCell>Subscriber</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((m: any) => (
                  <TableRow
                    key={m.id}
                    hover
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        background: `${colors.accent}10`,
                        transform: "scale(1.01)",
                      },
                      "& .MuiTableCell-root": {
                        borderBottom: `1px solid ${colors.accent}20`,
                        color: colors.text,
                        textAlign: "center",
                        py: 1.5,
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: colors.accent }}>
                      {m.number}
                    </TableCell>
                    <TableCell>
                      {m.subscriber?.fullName || (
                        <span style={{ color: colors.textSubtle, fontStyle: "italic" }}>
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {m.subscriber?.phone || (
                        <span style={{ color: colors.textSubtle, fontStyle: "italic" }}>
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
