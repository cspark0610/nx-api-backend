import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { AuthLoginInput } from './dto/auth-login.input'
import { AuthRegisterInput } from './dto/auth-register.input'
import { UserToken } from './models/user-token'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserToken)
  login(@Args({ name: 'inputLogin', type: () => AuthLoginInput }) inputLogin: AuthLoginInput) {
    return this.authService.login(inputLogin)
  }

  @Mutation(() => UserToken)
  register(@Args({ name: 'registerLogin', type: () => AuthRegisterInput }) registerLogin: AuthRegisterInput) {
    return this.authService.register(registerLogin)
  }
}
