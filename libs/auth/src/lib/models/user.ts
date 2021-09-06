import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string
  //el password es un Field que no voy a exponer

  password?: string
}
