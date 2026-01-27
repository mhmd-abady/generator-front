import type { Role } from "../context/AuthContext";

export type ReceiverType = "OWNER" | "EMPLOYEE" | "COLLECTOR";

export function mapRoleToReceiverType(role: Role): ReceiverType {
  if (role === "ADMIN") return "OWNER";
  if (role === "EMPLOYEE") return "EMPLOYEE";
  return "COLLECTOR";
}
