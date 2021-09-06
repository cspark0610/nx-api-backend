//TODAS LAS CLASES QUE SE HAGAN DENTRO DE MODELS SE DECORAN CON ObjectType()

import { Field, ObjectType } from '@nestjs/graphql'
import { Lesson } from './lesson'

@ObjectType()
export class Course {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  imageUrl?: string

  @Field(() => [Lesson], { nullable: true })
  lessons?: Lesson[]
}
