import { api } from "./axios";

export type ExpenseType = "OIL" | "MAINTENANCE" | "SALARY" | "OTHER";
export type SalaryExpenseRole = "COLLECTOR" | "EMPLOYEE";

export const EXPENSE_TYPE_OPTIONS: ExpenseType[] = [
	"OIL",
	"MAINTENANCE",
	"SALARY",
	"OTHER",
];

export type ExpenseUser = {
	id: number;
	username: string;
	role: string;
};

export type Expense = {
	id: number;
	amount: number;
	description?: string | null;
	type: ExpenseType;
	salaryRole?: SalaryExpenseRole | null;
	userId?: number | null;
	incurredAt?: string | null;
	createdAt?: string;
	user?: ExpenseUser | null;
};

export type CreateExpenseDto = {
	amount: number;
	description?: string;
	type: ExpenseType;
	salaryRole?: SalaryExpenseRole;
	userId?: number;
	incurredAt?: string;
};

export type UpdateExpenseDto = Partial<CreateExpenseDto>;

export const fetchExpenses = async (): Promise<Expense[]> => {
	const res = await api.get<Expense[]>("/expenses");
	return res.data;
};

export const createExpense = async (dto: CreateExpenseDto): Promise<Expense> => {
	const res = await api.post<Expense>("/expenses", dto);
	return res.data;
};

export const updateExpense = async (
	id: number,
	dto: UpdateExpenseDto
): Promise<Expense> => {
	const res = await api.patch<Expense>(`/expenses/${id}`, dto);
	return res.data;
};

export const deleteExpense = async (id: number): Promise<void> => {
	await api.delete(`/expenses/${id}`);
};
