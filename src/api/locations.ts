// src/api/locations.ts
import { api } from "./axios";

/* =========================
   TYPES
========================= */

export type Region = {
  id: number;
  name: string;
  neighborhoods?: Neighborhood[];
};

export type Neighborhood = {
  id: number;
  name: string;
  regionId: number;
};

/* =========================
   REGIONS API
========================= */

// GET /regions
export const fetchRegions = async (): Promise<Region[]> => {
  const res = await api.get("/regions");
  return res.data;
};

// GET /regions/:id
export const fetchRegionById = async (id: number): Promise<Region> => {
  const res = await api.get(`/regions/${id}`);
  return res.data;
};

// POST /regions
export const createRegion = async (payload: {
  name: string;
}): Promise<Region> => {
  const res = await api.post("/regions", payload);
  return res.data;
};

// PATCH /regions/:id
export const updateRegion = async (
  id: number,
  payload: { name?: string }
): Promise<Region> => {
  const res = await api.patch(`/regions/${id}`, payload);
  return res.data;
};

// DELETE /regions/:id
export const deleteRegion = async (id: number): Promise<void> => {
  await api.delete(`/regions/${id}`);
};

/* =========================
   NEIGHBORHOODS API
========================= */

// GET /neighborhoods
export const fetchNeighborhoods = async (): Promise<Neighborhood[]> => {
  const res = await api.get("/neighborhoods");
  return res.data;
};

// GET /neighborhoods/:id
export const fetchNeighborhoodById = async (
  id: number
): Promise<Neighborhood> => {
  const res = await api.get(`/neighborhoods/${id}`);
  return res.data;
};

// GET /neighborhoods/by-region/:regionId
export const fetchNeighborhoodsByRegion = async (
  regionId: number
): Promise<Neighborhood[]> => {
  const res = await api.get(`/neighborhoods/by-region/${regionId}`);
  return res.data;
};

// POST /neighborhoods
export const createNeighborhood = async (payload: {
  name: string;
  regionId: number;
}): Promise<Neighborhood> => {
  const res = await api.post("/neighborhoods", payload);
  return res.data;
};

// PATCH /neighborhoods/:id
export const updateNeighborhood = async (
  id: number,
  payload: { name?: string; regionId?: number }
): Promise<Neighborhood> => {
  const res = await api.patch(`/neighborhoods/${id}`, payload);
  return res.data;
};

// DELETE /neighborhoods/:id
export const deleteNeighborhood = async (id: number): Promise<void> => {
  await api.delete(`/neighborhoods/${id}`);
};
