import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import AuthDto from './dtos/auth.dto';
import { User } from 'src/users/entities/user.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import { Password } from 'src/common/password';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // логин
  async login({ email, password }: AuthDto) {
    const existingUser = await this.usersService.findByEmail(email);

    const passwordMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // @ts-ignore
    const payload = { email: existingUser.email, sub: existingUser.id };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  // генерация новой пары access_token, refresh_token
  async refresh(token: string) {
    try {
      const { email, sub } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const payload = { email, sub };

      return {
        access_token: await this.jwtService.signAsync(payload, {
          expiresIn: '24h',
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  // регистрация
  async register(userData: UserDto): Promise<User> {
    return await this.usersService.create(userData);
  }

  // useUser() hook
  async getProfile(id: string) {
    return await this.usersService.findById(id);
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
