import type { Actor, LocationOpt, StringOpt } from "src/app/type";

type SIP = {
	branchCode: StringOpt | null;
	noSIP: string | null;
	expiredAt: string | null;
};

type Practitioner = {
	practitionerRole: "doctor" | "nurse" | "pharmacist";
	sips: SIP[];
};

export type Employee = {
	photo: string | null;
	photoFile: File | null;
	id?: number;
	branchCode: string;
	ihs: string | null;
	nik: string;
	gender: string;
	prefixName: StringOpt[] | null;
	name: string;
	suffixName: StringOpt[] | null;
	birthDate: string | null;
	dialCode: StringOpt;
	phone: string;
	address: string;
	rw: string;
	rt: string;
	postalCode: string | null;
	hiredAt: string | null;
	resignedAt: string | null;
	branchCodes: StringOpt[];
	createdAt?: string;
	creator?: Actor;
	updatedAt?: string;
	updater?: Actor | null;
	position: StringOpt;
	practitioner: Practitioner | null;
	location: LocationOpt;
};

export const employeeTab = {
	EmployeeBioTab: "Bio",
	EmployeeAddressTab: "Alamat",
	EmployeePractitionerTab: "Detail Nakes",
} as const;

export type EmployeeTab = keyof typeof employeeTab;
