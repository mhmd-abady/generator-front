import { api } from "./axios";

export type Box = {
  id: number;
  code: string;
  neighborhoodId: number;
};

export const fetchBoxes = async (): Promise<Box[]> => {
  const res = await api.get<Box[]>("/boxes");
  return res.data;
};

export const fetchBoxesByNeighborhood = async (
  neighborhoodId: number
): Promise<Box[]> => {
  const res = await api.get<Box[]>(
    `/boxes/by-neighborhood/${neighborhoodId}`
  );
  return res.data;
};

export const createBox = async (dto: {
  code: string;
  neighborhoodId: number;
}) => {
  const res = await api.post("/boxes", dto);
  return res.data;
};

export const updateBox = async (
  id: number,
  dto: { code?: string; neighborhoodId?: number }
) => {
  const res = await api.patch(`/boxes/${id}`, dto);
  return res.data;
};

export const deleteBox = async (id: number) => {
  return api.delete(`/boxes/${id}`);
};