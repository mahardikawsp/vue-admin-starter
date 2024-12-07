export type BaseAct = "ADD" | "VIEW";

export type GetParam = {
	filters?: string;
	page?: number;
	take?: number;
	search?: string;
	orderBy?: string;
	order?: "asc" | "desc";
};

export type BaseOpt = {
	id: number;
	nama: string;
};

export type IdOpt = {
	id?: number;
	label?: string;
};

export type StringOpt = {
	value: string;
	label: string;
};

export type NumberOpt = {
	value: number;
	label: string;
};

export type DialCodeOpt = {
	value: string;
	dialCode: string;
	label: string;
};

export type Actor = {
	id: number;
	username: string;
};

export type LocationOpt = {
	province: StringOpt | null;
	city: StringOpt | null;
	district: StringOpt | null;
	village: StringOpt | null;
};

export type TabMenuProps = {
	className?: string;
};

export type FieldsCardProps = {
	id: string;
	index: number;
	// remove: UseFieldArrayRemove;
};

export type SingleFileResponse = {
	statusCode: number;
	message: string;
	file: string;
};

export type AuthResponse = {
	accessToken: string;
	refreshToken: string;
	user: CurrentUser;
	authLogId: number;
};

export type CurrentUser = {
	id: number;
	username: string;
	email: string;
	photo: string;
	isConsultant: boolean;
	employee: {
		id: number;
		branchCode: string;
		name: string;
		birthDate: string;
		resignedAt: string;
		position: {
			name: string;
		};
	};
};

export type Branch = {
	code: string;
	tag: string;
	name: string;
	legalName: string;
	email: string;
	address: string;
	location: LocationOpt;
	postalCode: string;
	phones: {
		home: string;
		shop: string;
		consul: string;
		appointment: string;
	};
};
