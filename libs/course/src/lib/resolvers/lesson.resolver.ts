import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CourseService } from '../course.prisma.service'
import { Lesson } from '../models/lesson'
import { CreateLessonInput } from '../dto/create-lesson.input'
import { UpdateLessonInput } from '../dto/update-lesson.input'
import { GqlAuthGuard } from '../../../../auth/src/lib/guards/gql-auth.guards'
import { CtxUser } from '../../../../auth/src/lib/decorators/ctx-user.decorator'
import { User } from '../../../../auth/src/lib/models/user'
import { UseGuards } from '@nestjs/common'

@Resolver()
@UseGuards(GqlAuthGuard)
export class LessonResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Lesson, { nullable: true })
  //para crear una lesson debo pasar si o si sobre que id de course voy a crear la lesson
  createLesson(
    @CtxUser() user: User,
    @Args('courseId') courseId: number,
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return this.courseService.createLesson(user.id, courseId, createLessonInput)
    //SOBRE course.service.ts VOY A AGREGAR EL METODO createLesson()
  }
  @Mutation(() => Lesson, { nullable: true })
  updateLesson(
    @CtxUser() user: User,
    @Args('lessonId') lessonId: number,
    @Args('updateLessonInput') updateLessonInput: UpdateLessonInput,
  ) {
    return this.courseService.updateLesson(user.id, lessonId, updateLessonInput)
  }
  @Mutation(() => Boolean, { nullable: true })
  deleteLesson(@CtxUser() user: User, @Args('lessonId') lessonId: number) {
    return this.courseService.deleteLesson(user.id, lessonId)
  }
}
