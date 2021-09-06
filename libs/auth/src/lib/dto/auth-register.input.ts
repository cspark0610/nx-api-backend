import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AuthRegisterInput {
  @Field({ nullable: true })
  firstName: string
  @Field({ nullable: true })
  lastName: string
  @Field()
  email: string
  @Field()
  password: string
}
