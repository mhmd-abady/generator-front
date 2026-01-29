import React, { memo } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Box,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import { useTheme as useAppTheme } from "../context/ThemeContext";

interface Column<T> {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
  render: (row: T) => React.ReactNode;
  hiddenOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  title?: string;
  actions?: React.ReactNode;
  density?: "compact" | "normal" | "comfortable";
  striped?: boolean;
  hoverable?: boolean;
  maxHeight?: string | number;
  sx?: SxProps<Theme>;
}

function DataTableComponent<T extends Record<string, any>>({
  columns,
  rows,
  loading = false,
  emptyMessage = "No data available",
  title,
  actions,
  density = "normal",
  striped = true,
  hoverable = true,
  maxHeight,
  sx,
}: DataTableProps<T>) {
  const { colors } = useAppTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const visibleColumns = columns.filter(
    (col) => !(col.hiddenOnMobile && isMobile)
  );

  const tableSizeProps =
    density === "compact"
      ? { size: "small" as const }
      : density === "comfortable"
      ? { size: "medium" as const }
      : {};

  const paddingMap = {
    compact: "8px 12px",
    normal: "12px 16px",
    comfortable: "16px 20px",
  };

  const cellPadding = paddingMap[density];

  return (
    <Paper
      sx={[
        {
          p: { xs: 1.5, sm: 2, md: 2.5 },
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${colors.darker}99 0%, ${colors.darker}66 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.border}33`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 ${colors.border}22`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: `0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 ${colors.border}33`,
          },
        },
        sx as any,
      ]}
    >
      {/* Header Section */}
      {(title || actions) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 2,
            borderBottom: `1px solid ${colors.border}33`,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {title}
            </Typography>
          )}
          {actions && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Table Section */}
      {loading ? (
        <Box sx={{ p: 2 }}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </Box>
      ) : !rows || rows.length === 0 ? (
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            borderRadius: "8px",
            background: `${colors.darker}33`,
            border: `1px dashed ${colors.border}44`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: colors.textSubtle,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            maxHeight: maxHeight,
            overflowX: "auto",
            borderRadius: "8px",
            "& .MuiTable-root": {
              minWidth: { xs: "600px", sm: "100%" },
            },
          }}
        >
          <Table {...tableSizeProps}>
            <TableHead>
              <TableRow
                sx={{
                  background: `linear-gradient(135deg, ${colors.darker}66 0%, ${colors.darker}33 100%)`,
                  borderBottom: `2px solid ${colors.border}66`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.darker}77 0%, ${colors.darker}44 100%)`,
                  },
                }}
              >
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{
                      width: column.width,
                      fontWeight: 700,
                      color: colors.accent,
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      padding: cellPadding,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      textShadow: `0 1px 2px rgba(0, 0, 0, 0.1)`,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  sx={{
                    background:
                      striped && rowIndex % 2 === 1
                        ? `${colors.darker}22`
                        : "transparent",
                    borderBottom: `1px solid ${colors.border}33`,
                    transition: "all 0.2s ease",
                    ...(hoverable && {
                      "&:hover": {
                        background: `linear-gradient(90deg, ${colors.darker}44 0%, ${colors.darker}33 100%)`,
                        boxShadow: `inset 0 0 8px ${colors.darker}33`,
                        "& > .MuiTableCell-root": {
                          color: colors.accent,
                        },
                      },
                    }),
                  }}
                >
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={`${row.id || rowIndex}-${column.id}`}
                      align={column.align || "left"}
                      sx={{
                        width: column.width,
                        color: colors.text,
                        fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.95rem" },
                        padding: cellPadding,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default memo(DataTableComponent) as <T extends Record<string, any>>(
  props: DataTableProps<T>
) => React.JSX.Element;
