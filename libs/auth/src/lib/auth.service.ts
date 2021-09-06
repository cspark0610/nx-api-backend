import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { DataService } from '@newapi/data'
import { AuthHelper } from './auth.helper'
import { AuthLoginInput } from './dto/auth-login.input'
import { AuthRegisterInput } from './dto/auth-register.input'
import { JwtDto } from './dto/jwt-dto'
import { UserToken } from './models/user-token'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private readonly data: DataService, private readonly jwtService: JwtService) {}

  /*
  1. Buscar el user by email, usando el metodo de dataService,
  2. Si no Existe el user lanzar un error NotFoundException()
  3. si Existe el user entonces debo validar el password
  4. si no Existe el password lanzar error que el password es invalido
  5. una vez pasadas las dos validaciones retornar como objeto el user y el token
  */
  public async login(authLoginInput: AuthLoginInput): Promise<UserToken> {
    const { email, password } = authLoginInput
    const foundUser = await this.data.findUserByEmail(email)
    if (!foundUser) throw new NotFoundException(`user with email ${email} does not exists`)
    const passwordValid = await AuthHelper.validate(password, foundUser.password)
    if (!passwordValid) throw new Error('Invalid password')
    return { user: foundUser, token: this.signToken(foundUser.id) }
  }
  /*
  Register:
  1. make sure that there is no user with the email already, email is @unique according to schema the
  2. si ya existe un user con el email throw a BadRequestException
  3. Cuando registro añl user DEBO HASHEAR SU FIELD PASSWORD
  */
  public async register(authRegisterInput: AuthRegisterInput): Promise<UserToken> {
    const { firstName, lastName, email } = authRegisterInput
    const foundUser = await this.data.findUserByEmail(email)
    if (foundUser) throw new BadRequestException(`Cannot register with email ${email}`)
    const password = await AuthHelper.hash(authRegisterInput.password)

    const createdUser = await this.data.createUser({
      firstName,
      lastName,
      email,
      password,
    })

    return { user: createdUser, token: this.signToken(createdUser.id) }
    //antes de implementar el token lo hardcodeo
  }

  private signToken(id: number) {
    const payload: JwtDto = { userId: id }
    return this.jwtService.sign(payload)
  }

  public async validateUser(userId: number) {
    return this.data.findUserById(userId)
  }
}
