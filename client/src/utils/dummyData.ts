import { IRoom } from "../components/RoomPanel";
import { IUser } from "../hooks/useJoinRoom";

export const dummyRooms: IRoom[] = [
    {
        id: '1',
        name: 'General Chat',
        creatorId: 'user1',
        avatar: 'https://example.com/avatar1.png',
        createdTime: new Date('2023-01-01T10:00:00Z'),
        activeUsers: 5
    },
    {
        id: '2',
        name: 'Tech Talk',
        creatorId: 'user2',
        avatar: 'https://example.com/avatar2.png',
        createdTime: new Date('2023-01-02T11:00:00Z'),
        activeUsers: 3
    },
    {
        id: '3',
        name: 'Gaming Room',
        creatorId: 'user3',
        avatar: 'https://example.com/avatar3.png',
        createdTime: new Date('2023-01-03T12:00:00Z'),
        activeUsers: 8
    },
    {
        id: '4',
        name: 'Music Lovers',
        creatorId: 'user4',
        avatar: 'https://example.com/avatar4.png',
        createdTime: new Date('2023-01-04T13:00:00Z'),
        activeUsers: 2
    },
    {
        id: '5',
        name: 'Study Group',
        creatorId: 'user5',
        avatar: 'https://example.com/avatar5.png',
        createdTime: new Date('2023-01-05T14:00:00Z'),
        activeUsers: 10
    }
];

export const dummyUsers: IUser[] = [
    {
        id: '1',
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        avatar: 'https://example.com/avatar1.png'
    },
    {
        id: '2',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        avatar: 'https://example.com/avatar2.png'
    },
    {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        avatar: 'https://example.com/avatar3.png'
    },
    {
        id: '4',
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        avatar: null // No avatar
    },
    {
        id: '5',
        name: 'Eve Davis',
        email: 'eve.davis@example.com',
        avatar: 'https://example.com/avatar5.png'
    }
];
