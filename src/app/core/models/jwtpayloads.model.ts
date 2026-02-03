export interface JwtPayload {
    userId: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    workspaceId: number;
    workspaceName: string;
    workspaceActive: boolean;
    workspaceSystemDefined: boolean;
    roles: string[];
    sub: string;
    exp: number;
    iat: number;
    [key: string]: any;
}
