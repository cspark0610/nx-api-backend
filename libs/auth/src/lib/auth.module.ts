import { Module } from '@nestjs/common'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { DataModule } from '@newapi/data'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { GqlAuthGuard } from './guards/gql-auth.guards'

@Module({
  imports: [
    DataModule,
    JwtModule.register({
      secret: 'secret123',
    }),
  ],
  controllers: [],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard],
  exports: [],
})
export class AuthModule {}
