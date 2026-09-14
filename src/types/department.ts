export interface Department {
  id: string;
  name: string;
  managerId: string | null;
  managerName?: string | null;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  managerId?: string | null;
}

export interface UpdateDepartmentDto {
  name: string;
  managerId?: string | null;
}
