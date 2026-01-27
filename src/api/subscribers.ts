import { api } from "./axios";

export type SubscriberPayment = {
  id: number;
  amount: number;
  paidAt: string;
  isReversed: boolean;
};

export type Subscriber = {
  id: number;
  fullName: string;
  phone: string;
  address?: string;
  createdAt: string;

  meters?: {
    id: number;
    number: string;
    boxId: number;
    box?: {
      id: number;
      code: string;
      neighborhoodId: number;
    };
  }[];

  payments?: SubscriberPayment[];
};


export type CreateSubscriberDto = {
  fullName: string;
  phone: string;
  address?: string;
};

export type UpdateSubscriberDto = Partial<CreateSubscriberDto>;

/*
 * GET /subscribers
 */
export const fetchSubscribers = async (): Promise<Subscriber[]> => {
  const res = await api.get<Subscriber[]>("/subscribers");
  return res.data;
};

/*
 * GET /subscribers/:id
 */
export const fetchSubscriberById = async (
  id: number
): Promise<Subscriber> => {
  const res = await api.get<Subscriber>(`/subscribers/${id}`);
  return res.data;
};

/*
 * GET /subscribers/by-neighborhood/:neighborhoodId
 */
export const fetchSubscribersByNeighborhood = async (
  neighborhoodId: number
): Promise<Subscriber[]> => {
  const res = await api.get<Subscriber[]>(
    `/subscribers/by-neighborhood/${neighborhoodId}`
  );
  return res.data;
};

/*
 * POST /subscribers
 */
export const createSubscriber = async (
  dto: CreateSubscriberDto
): Promise<Subscriber> => {
  const res = await api.post<Subscriber>("/subscribers", dto);
  return res.data;
};

/*
 * PATCH /subscribers/:id
 */
export const updateSubscriber = async (
  id: number,
  dto: UpdateSubscriberDto
): Promise<Subscriber> => {
  const res = await api.patch<Subscriber>(`/subscribers/${id}`, dto);
  return res.data;
};

/*
 * DELETE /subscribers/:id
 */
export const deleteSubscriber = async (id: number): Promise<void> => {
  await api.delete(`/subscribers/${id}`);
};
