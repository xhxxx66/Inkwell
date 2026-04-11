import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    getProfile(req: any): Promise<{
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
