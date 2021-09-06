import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CoreModule } from '../../../../libs/core/src/lib/core.module'
import { DataModule } from '../../../../libs/data/src/lib/data.module'
import { CourseModule } from '../../../../libs/course/src/lib/course.module'
import { AuthModule } from '../../../../libs/auth/src/lib/auth.module'

@Module({
  imports: [AuthModule, CoreModule, CourseModule, DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
