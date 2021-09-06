import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { CourseService } from '../course.prisma.service'
import { Course } from '../models/course'
import { CreateCourseInput } from '../dto/create-course.input'
import { UpdateCourseInput } from '../dto/update-course.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../../../../auth/src/lib/guards/gql-auth.guards'
import { CtxUser } from '../../../../auth/src/lib/decorators/ctx-user.decorator'
import { User } from '../../../../auth/src/lib/models/user'

//DESDE EL CONSTRUCTOR DEL RESOLVER SIEMPRE HACER UNA INSTANCIA DEL SERVICIO ASOCIADO
//readecuar el type del argumento id SEGUN LO QUE DEFINI EN prisma.schema
@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Query(() => [Course], { nullable: true })
  courses() {
    return this.courseService.courses()
  }
  @Query(() => Course, { nullable: true })
  course(@Args('id') id: number) {
    return this.courseService.course(id)
  }

  // el metodo en si va a ser decorado con @Args y voy a recibir un DTO como inputType()
  //el nombre que le ponga a @Args('input') SIGNIFICA QUE EN EL PLAYGROUND el argument se va a llamar input

  @UseGuards(GqlAuthGuard) //debo estar logueado para poder crear un curso
  @Mutation(() => Course, { nullable: true })
  createCourse(@CtxUser() user: User, @Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.courseService.createCourse(user.id, createCourseInput)
  }
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Course, { nullable: true })
  updateCourse(@CtxUser() user: User, @Args('id') id: number, @Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
    return this.courseService.updateCourse(user.id, id, updateCourseInput)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean, { nullable: true })
  deleteCourse(@CtxUser() user: User, @Args('id') id: number) {
    return this.courseService.deleteCourse(user.id, id)
  }
}
