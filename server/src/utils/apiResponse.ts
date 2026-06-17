class ApiResponse<T = any> {
    public success: boolean;
    public statusCode: number;
    public message: string;
    public data?: T;

    constructor({
        statusCode,
        message = "Success",
        data,
    }: {
        statusCode: number;
        message?: string;
        data?: T;
    }) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }

    toJSON() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        };
    }
}

export { ApiResponse };