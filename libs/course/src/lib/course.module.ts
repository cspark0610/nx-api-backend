import { Module } from '@nestjs/common'
import { CourseResolver } from './resolvers/course.resolver'
import { CourseService } from './course.prisma.service'
import { LessonResolver } from './resolvers/lesson.resolver'
import { DataModule } from '@newapi/data'

@Module({
  controllers: [],
  imports: [DataModule],
  providers: [CourseResolver, CourseService, LessonResolver],
  exports: [],
})
export class CourseModule {}
