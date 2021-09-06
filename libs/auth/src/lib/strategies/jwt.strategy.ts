import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { JwtDto } from '../dto/jwt-dto'
/**
 * class JwtStrategie
 * SINO LO DECORO CON @Injectable() no lO PUEDO PONER COMO PROVIDER EN auth.module !!
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret123',
    })
  }
  //con AuthService voy a validar el user con el payload que me llega desde el metodo public validateUser()
  async validate(payload: JwtDto) {
    const user = await this.authService.validateUser(payload.userId)
    // console.log('payload', payload)
    // console.log('user', user)
    if (!user) throw new UnauthorizedException()
    return user
  }
}
