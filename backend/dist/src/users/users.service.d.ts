import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    register(createUserDto: CreateUserDto): Promise<{
        code: number;
        msg: string;
        data: {
            id: number;
            createdAt: Date;
            username: string;
            nickname: string | null;
            avatar: string | null;
        };
    }>;
    findById(id: number): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
            createdAt: Date;
            username: string;
            nickname: string | null;
            avatar: string | null;
            email: string | null;
            phone: string | null;
            gender: string;
            bio: string | null;
        };
    }>;
}
