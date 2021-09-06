import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { AuthRegisterInput } from '../../../auth/src/lib/dto/auth-register.input'

@Injectable()
export class DataService extends PrismaClient {
  private readonly defaultAdmin: AuthRegisterInput = {
    firstName: 'admin',
    lastName: 'admin',
    email: `${process.env.ADMIN_EMAIL}`,
    password: `${process.env.ADMIN_PASSWORD}`,
  }
  constructor(private readonly config: ConfigService) {
    super()
    this.defaultAdmin = this.config.get('admin')
    //console.log(this.defaultAdmin);
  }
  /**
   * OnModuleDestroy
   */
  public async OnModuleDestroy() {
    await this.$disconnect()
  }
  /**
   * OnModuleInit
   */
  public async OnModuleInit() {
    await this.$connect()
    await this.ensureAdminUser()
  }

  public async createUser(authRegisterInput: AuthRegisterInput) {
    const createdUser = await this.user.create({
      data: {
        ...authRegisterInput,
      },
    })
    //console.log('createdUser', createdUser)
    return createdUser
  }
  /**
   * findUserByEmail , this.prisma.findOne() esta deprecado!! usar findUnque
   * el field dentro del model User de email debe estar decorado con el unique()
   */
  public async findUserByEmail(email: string) {
    const foundUser = await this.user.findUnique({
      where: {
        email,
      },
    })
    return foundUser
  }

  public async findUserById(userId: number) {
    return this.user.findFirst({
      where: {
        id: userId,
      },
    })
  }

  private async ensureAdminUser() {
    // Check if we have an admin
    const found = await this.findUserByEmail(this.defaultAdmin.email)

    if (found) {
      Logger.log(`Admin user: ${found.email}`, 'DataService')
      return true
    }

    // If not, create it for us
    const created = await this.createUser(this.defaultAdmin)

    Logger.log(`Created Admin user: ${created.email}`, 'DataService')
  }
}
