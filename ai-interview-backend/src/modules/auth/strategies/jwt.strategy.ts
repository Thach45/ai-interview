import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../../../common/types/jwt.type';
import { UnauthorizedException } from '../../../common/exceptions/AppException';
import { isUUID } from 'class-validator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'secret',
    });
  }

  async validate(payload: TokenPayload): Promise<TokenPayload> {
    if (!isUUID(payload.id)) {
      throw new UnauthorizedException(
        'Token được tạo từ dữ liệu cũ, vui lòng đăng nhập lại',
      );
    }

    return payload;
  }
}
