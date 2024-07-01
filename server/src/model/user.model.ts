import prisma from "../client";
const AVATAR_API_BASE_URL = "https://robohash.org/"

export class User {
    private id: string;
    private name: string;
    private email: string;
    private password: string;
    private avatar: string | null;

    constructor(id: string, name: string, email: string, password: string, avatar: string | null = null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
    }

    //find the user by id
    static async getUserById(userId: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;
        return new User(user.id, user.name, user.email, user.password, user.avatar);
    }

    //find user by email 
    static async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return new User(user.id, user.name, user.email, user.password, user.avatar);
    }

    //static method to create new user

    static async createUser(name: string, email: string, password: string): Promise<User> {
        const user = await prisma.user.create({
            data: { name, email, password, avatar: AVATAR_API_BASE_URL + email }
        });

        return new User(user.id, user.name, user.email, user.password, user.avatar);
    }

    //static function to get the room joined by the user;


    async save(): Promise<void> {
        await prisma.user.update({
            where: { id: this.id },
            data: {
                name: this.name,
                email: this.email,
                password: this.password,
                avatar: this.avatar
            }
        });
    }


    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAvatar(): string | null {
        return this.avatar;
    }

    // Setters
    setName(name: string): void {
        this.name = name;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPassword(password: string): void {
        this.password = password;
    }

    setAvatar(avatar: string): void {
        this.avatar = avatar;
    }
}