import { compare, hash } from 'bcryptjs'

//bcryptjs se usa para hashear la password y validarla cuando se hace el login o el signin
export class AuthHelper {
  static hash(password: string): Promise<string> {
    return hash(password, 10)
  }
  static validate(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
