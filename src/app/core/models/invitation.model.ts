export interface Inviation {
    id: number;
    email: string;
    workspaceId: number;
    inviationDate: Date;
}

export interface CreateInvitation {
    email: string;
}

export interface UpdateInvitation {
    email: string;
}
