export type TUser = {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    createdRooms: TRoom[];
    roomMembers: TRoomUser[];
    messages: TMessage[];
};

export type TMessage = {
    id: string;
    sender: TUser;
    senderId: string;
    content: string;
    timestamp: Date;
    room: TRoom;
    roomId: string;
};

export type TRoom = {
    id: string;
    name: string;
    creator: TUser;
    creatorId: string;
    avatar?: string;
    messages: TMessage[];
    createdTime: Date;
    activeUsers: number;
    users: TRoomUser[];
};

export type TRoomUser = {
    userId: string;
    roomId: string;
    user: TUser;
    room: TRoom;
};
