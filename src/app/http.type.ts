export type BaseResponse<T> = {
    result: never[];
    statusCode: number;
    message: string | null;
    data: T;
};

export type BaseGetAllResponse<T> = BaseResponse<{
    count: number;
    countAll: number;
    totalPage: number;
    result: T;
}>;

export type BaseFilesResponse = {
    statusCode: number;
    message: string | null;
    files: Array<string | null>;
};

export type BaseFileResponse = {
    statusCode: number;
    message: string | null;
    file: string;
};