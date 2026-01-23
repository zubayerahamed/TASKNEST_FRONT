export interface UserWorkspace {
    userId: number;
    workspaceId: number;
    isPrimary: boolean;
    isAdmin: boolean;
    isCollaborator: boolean;
}