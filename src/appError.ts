/*
 * Pass around basic error information
 */
export interface AppError {
    status: number;
    code: string;
    message: string;
}
