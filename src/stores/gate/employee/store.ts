import type { GetParam } from '@/app/type';
import type { Employee, EmployeeTab } from './type';
import { defineStore } from 'pinia';
import { http, useHttpFile } from '@/app/http';

type Action = 'ADD' | 'EDIT' | 'VIEW';
type EmployeeState = {
  getParams?: GetParam;
  loading: boolean;
  isFetchFromScroll: boolean;
  totalPage: number;
  employees: Employee[];
  action?: Action;
  employee?: Employee;
  activeTab: EmployeeTab;
  fetchingSatuSehat: boolean;
  posting: boolean;
};

const initialState: EmployeeState = {
  getParams: { page: 1, take: 22 },
  loading: false,
  isFetchFromScroll: false,
  totalPage: 0,
  employees: [],
  activeTab: 'EmployeeBioTab',
  fetchingSatuSehat: false,
  posting: false
};

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    ...initialState
  }),
  getters: {
    loadEmployees: (state) => {
      return state.employees;
    },
    loadEmployee: (state) => {
      return state.employee;
    }
  },
  actions: {
    resetEmployeeState() {
      this.employee = undefined;
    },
    async setEmployee(filters?: string) {
      this.loading = true;
      try {
        // const { ...getParams } = this.getParams || {};
        const getParams = {
          ...this.getParams,
          filters: filters || '' // Add filters if provided
        };
        const response = await http.get('/gate/employees', {
          params: getParams
        });
        this.employees = response.data.result;
        this.totalPage = response.data.totalPages;
        // console.log("Employees state:", this.employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        this.loading = false;
      }
    },
    async setEmployeeById(id: string) {
      this.resetEmployeeState();
      this.loading = true;
      try {
        const response = await http.get(`/gate/employee/${id}`);
        this.employee = response.data;
      } catch (error) {
        console.error('Error fetching employee by ID:', error);
      } finally {
        this.loading = false;
      }
    },
    async updateEmployee(employeeData: Employee) {
      this.loading = true;
      try {
        // const param = employeeData.id;
        // console.log(param, ' idnya');
        // delete employeeData.id;
        const { id, attendanceUserId, attendanceUserLabel, location, ...data } =
          employeeData;
        const payloadUpdate = {
          ...data,
          branchCodes: [
            {
              value: data.branchCodes[0],
              label: data.branchCodes[0]
            }
          ]
        };

        const response = await http.put(`/gate/employee/${id}`, payloadUpdate);

        // Update the local employee state with the new data
        this.employee = response.data; // Assuming the response contains the updated employee data
        // Optionally, you can also update the employees array if needed
        const index = this.employees.findIndex(
          (emp) => emp.id === employeeData.id
        );
        if (index !== -1) {
          this.employees[index] = response.data; // Update the specific employee in the list
        }
      } catch (error) {
        console.error('Error updating employee:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchPhotoUrl(filename: string): Promise<string | null | undefined> {
      // Validate filename
      if (!filename) {
        console.warn('No filename provided');
        return null;
      }

      try {
        // Fetch photo using HTTP file utility
        const { data } = await useHttpFile(`file/gate/user/${filename}`);

        // Validate Blob response
        if (data instanceof Blob) {
          // Create object URL for the image
          const photoUrl = URL.createObjectURL(data);

          // Optional: Revoke URL to prevent memory leaks
          setTimeout(
            () => {
              URL.revokeObjectURL(photoUrl);
            },
            5 * 60 * 1000
          ); // Revoke after 5 minutes
          return photoUrl;
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
        return null;
      }
    }
  },
  persist: {
    enabled: true
  }
});
