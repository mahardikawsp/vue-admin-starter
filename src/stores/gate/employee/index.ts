import type { GetParam } from "@/app/type";
import type { Employee, EmployeeTab } from "./type";
import { defineStore } from "pinia";
import { http } from "@/app/http";

type Action = "ADD" | "EDIT" | "VIEW";
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
	activeTab: "EmployeeBioTab",
	fetchingSatuSehat: false,
	posting: false,
};

export const useEmployeeStore = defineStore("employee", {
	state: () => ({
		...initialState,
	}),
	getters: {
		loadEmployee: (state) => {
			return state.employees;
		},
	},
	actions: {
		async setEmployee(filters?: string) {
			this.loading = true;
			try {
				// const { ...getParams } = this.getParams || {};
				const getParams = {
					...this.getParams,
					filters: filters || "", // Add filters if provided
				};
				const response = await http.get("/gate/employees", {
					params: getParams,
				});
				this.employees = response.data.result;
				this.totalPage = response.data.totalPages;
				// console.log("Employees state:", this.employees);
			} catch (error) {
				console.error("Error fetching employees:", error);
			} finally {
				this.loading = false;
			}
		},
	},
});
