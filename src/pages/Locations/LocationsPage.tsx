import {
  Paper,
  Stack,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useState } from "react";
import DashboardLayout from "../Dashboard/DashboardLayout";
import { useRegions } from "../../hooks/useRegions";
import { useNeighborhoods } from "../../hooks/useNeighborhoods";
import type { Region, Neighborhood } from "../../api/locations";
import { useBoxes } from "../../hooks/useBoxes";
import type { Box } from "../../api/boxes";
import { useMeters } from "../../hooks/useMeters";
import MetersTable from "../Meters/MetersTable";
import { useBoxMeters } from "../../hooks/useBoxMeters";
import MeterFormDialog from "../Meters/MeterFormDialog";

export default function LocationsPage() {
  const { regions, createRegion, updateRegion, deleteRegion } = useRegions();
  const {
    neighborhoods,
    createNeighborhood,
    updateNeighborhood,
    deleteNeighborhood,
  } = useNeighborhoods();

  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  /* dialogs */
  const [open, setOpen] = useState<"region" | "hood" | null>(null);
  const [editing, setEditing] = useState<Region | Neighborhood | null>(null);
  const [name, setName] = useState("");

  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<Neighborhood | null>(null);
  const [boxOpen, setBoxOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [boxCode, setBoxCode] = useState("");
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [meterDialogOpen, setMeterDialogOpen] = useState(false);

  const { boxes, isLoading: boxesLoading, createBox, updateBox, deleteBox } =
    useBoxes(selectedNeighborhood?.id, selectedRegion?.id);
  const metersQuery = useMeters({
    regionId: selectedRegion?.id,
    neighborhoodId: selectedNeighborhood?.id,
  });
  const boxMetersQuery = useBoxMeters(selectedBox?.id);

  const meters = selectedBox ? boxMetersQuery.data : metersQuery.meters;
  const metersLoading = selectedBox
    ? boxMetersQuery.isLoading
    : metersQuery.isLoading;

  const resetBoxDialog = () => {
    setEditingBox(null);
    setBoxCode("");
  };

  const closeBoxDialog = () => {
    setBoxOpen(false);
    resetBoxDialog();
  };

  const submitRegion = () => {
    if (!name.trim()) return;

    if (editing) {
      updateRegion.mutate({ id: (editing as Region).id, data: { name } });
    } else {
      createRegion.mutate({ name });
    }
    setOpen(null);
  };

  const submitNeighborhood = () => {
    if (!name.trim() || !selectedRegion) return;

    if (editing) {
      updateNeighborhood.mutate({
        id: (editing as Neighborhood).id,
        data: { name, regionId: selectedRegion.id },
      });
    } else {
      createNeighborhood.mutate({
        name,
        regionId: selectedRegion.id,
      });
    }
    setOpen(null);
  };

  const submitBox = () => {
    if (!boxCode.trim() || !selectedNeighborhood) return;

    if (editingBox) {
      updateBox.mutate({
        id: editingBox.id,
        dto: { code: boxCode, neighborhoodId: selectedNeighborhood.id },
      });
    } else {
      createBox.mutate({
        code: boxCode,
        neighborhoodId: selectedNeighborhood.id,
      });
    }

    closeBoxDialog();
  };

  return (
    <DashboardLayout>
      <Stack direction="row" spacing={2}>
        {/* ================= REGIONS ================= */}
        <Paper sx={{ width: 280, p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>Regions</Typography>
            <IconButton
              onClick={() => {
                setEditing(null);
                setName("");
                setOpen("region");
                setSelectedBox(null);
                resetBoxDialog();
              }}
            >
              <Add />
            </IconButton>
          </Stack>

          <List>
            {regions.map((r) => (
              <ListItemButton
                key={r.id}
                selected={r.id === selectedRegion?.id}
                onClick={() => {
                  setSelectedRegion(r);
                  setSelectedNeighborhood(null);
                  setSelectedBox(null);
                  resetBoxDialog();
                }}
              >
                <ListItemText primary={r.name} />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(r);
                    setName(r.name);
                    setOpen("region");
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRegion.mutate(r.id);
                    setSelectedRegion((prev) =>
                      prev?.id === r.id ? null : prev
                    );
                    setSelectedNeighborhood(null);
                    setSelectedBox(null);
                    resetBoxDialog();
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* ================= NEIGHBORHOODS ================= */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>
              Neighborhoods {selectedRegion && `- ${selectedRegion.name}`}
            </Typography>

            <Button
              variant="contained"
              disabled={!selectedRegion}
              onClick={() => {
                setEditing(null);
                setName("");
                setOpen("hood");
              }}
            >
              Add Neighborhood
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {!selectedRegion ? (
            <Typography color="text.secondary">
              Select a region to manage neighborhoods
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {neighborhoods
                  .filter((n) => n.regionId === selectedRegion.id)
                  .map((n) => (
                    <TableRow
                      key={n.id}
                      hover
                      selected={n.id === selectedNeighborhood?.id}
                      onClick={() => {
                        setSelectedNeighborhood(n);
                        setSelectedBox(null);
                        resetBoxDialog();
                      }}
                    >
                      <TableCell>{n.name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(n);
                            setName(n.name);
                            setOpen("hood");
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNeighborhood.mutate(n.id);
                            setSelectedNeighborhood((prev) =>
                              prev?.id === n.id ? null : prev
                            );
                            setSelectedBox(null);
                            resetBoxDialog();
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* ================= BOXES ================= */}
        <Paper sx={{ width: 320, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={600}>
              Boxes {selectedNeighborhood && `- ${selectedNeighborhood.name}`}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              disabled={!selectedNeighborhood}
              onClick={() => {
                resetBoxDialog();
                setBoxOpen(true);
              }}
            >
              Add Box
            </Button>
          </Stack>

          <Divider sx={{ my: 1 }} />

          {!selectedNeighborhood ? (
            <Typography color="text.secondary">
              Select a neighborhood to view boxes
            </Typography>
          ) : boxesLoading ? (
            <Typography>Loading...</Typography>
          ) : boxes.length === 0 ? (
            <Typography color="text.secondary">No boxes</Typography>
          ) : (
            <List>
              {boxes.map((b) => (
                <ListItemButton
                  key={b.id}
                  selected={b.id === selectedBox?.id}
                  onClick={() => setSelectedBox(b)}
                >
                  <ListItemText primary={b.code} />

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBox(b);
                      setBoxCode(b.code);
                      setBoxOpen(true);
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBox.mutate(b.id);
                      setSelectedBox((prev) => (prev?.id === b.id ? null : prev));
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </Stack>

      {/* =============== METERS TABLE (filtered by selected region/hood/box) =============== */}
      <Paper sx={{ mt: 2, p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography fontWeight={600}>
            Meters
            {selectedBox
              ? ` - Box ${selectedBox.code}`
              : selectedNeighborhood
              ? ` - Neighborhood ${selectedNeighborhood.name}`
              : selectedRegion
              ? ` - Region ${selectedRegion.name}`
              : ""}
              <Button
              sx={{ml:13}}
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => setMeterDialogOpen(true)}
            >
              Add Meter
            </Button>
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {metersLoading && <CircularProgress size={20} />}
            
          </Stack>
        </Stack>
        <MetersTable rows={meters ?? []} disablePaper />
      </Paper>

      {/* ================= DIALOGS ================= */}
      <Dialog open={!!open} onClose={() => setOpen(null)}>
        <DialogTitle>
          {open === "region"
            ? editing
              ? "Edit Region"
              : "Add Region"
            : editing
            ? "Edit Neighborhood"
            : "Add Neighborhood"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={open === "region" ? submitRegion : submitNeighborhood}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={boxOpen} onClose={closeBoxDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editingBox ? "Edit Box" : "Add Box"}</DialogTitle>

        <DialogContent>
          <TextField
            label="Box Code"
            value={boxCode}
            onChange={(e) => setBoxCode(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closeBoxDialog}>Cancel</Button>
          <Button variant="contained" onClick={submitBox}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <MeterFormDialog
        open={meterDialogOpen}
        onClose={() => setMeterDialogOpen(false)}
      />

    </DashboardLayout>
  );
}
