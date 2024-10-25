import { User } from "src/modules/users/entities/user.entity";

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User>;
  login(user: User): Promise<{ access_token: string }>;
}
