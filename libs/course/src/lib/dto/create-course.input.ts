import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCourseInput {
  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  imageUrl?: string
}
//este es el "shape" del tipo input que voy a recibir desde el cliente para crear un Course
//que va a entrar como parametro dentro del metodo createCourse del resolver createCourse