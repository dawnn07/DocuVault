import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret_key',
    });
  }
  /**
   * Validates the JWT payload and returns the user object.
   * @param payload The decoded JWT payload.
   * @returns An object containing user information.
   */
  validate(payload: { sub: string; email: string }) {
    console.log('JwtStrategy.validate payload:', payload);
    // return user object or throw
    return { id: payload.sub, email: payload.email };
  }
}
