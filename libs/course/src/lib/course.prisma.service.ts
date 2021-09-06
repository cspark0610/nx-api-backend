import { Injectable, NotFoundException } from '@nestjs/common'
import { DataService } from '@newapi/data'
//import { Course } from './models/course'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { CreateLessonInput } from './dto/create-lesson.input'
import { UpdateLessonInput } from './dto/update-lesson.input'

//reescribir el CourseService usando los metodos del clientePrisma
@Injectable()
export class CourseService {
  //ARMAR UNA INSTANCIA DE DATASERVICE, LA CUAL ES UNA CLASE QUE EXTIENDE PRISMACLIENT
  constructor(private readonly data: DataService) {}
  //data.prismaClientName.method()
  private readonly courseInclude = {
    author: true,
    lessons: true,
  }

  public async courses() {
    return await this.data.course.findMany({ include: this.courseInclude })
  }

  public async course(id: number) {
    const found = await this.data.course.findFirst({
      include: this.courseInclude,
      where: { id },
    })
    if (!found) throw new NotFoundException(`Course with id ${id} not found!`)
    return found
  }

  public async createCourse(userId: number, createCourseInput: CreateCourseInput) {
    return await this.data.course.create({
      data: {
        ...createCourseInput,
        author: { connect: { id: userId } },
      },
    })
  }

  public async updateCourse(userId: number, id: number, updateCourseInput: UpdateCourseInput) {
    const course = await this.course(id)
    return this.data.course.update({
      where: { id: course.id },
      data: {
        ...updateCourseInput,
        author: { connect: { id: userId } },
      },
    })
  }

  public async deleteCourse(userId: number, id: number) {
    const deleted = await this.data.course.delete({
      where: { id },
    })
    return !!deleted
  }
  /*
    mutation {
      deleteCourse( id: 2 ) 
    }

  */

  /**
   * createLesson (prismaClient : lesson)
   * Busco primero el course usando el courseId, reutilizo el metodo course(courseId)
   * Luego uso el metodo .create({ data : {}, })
   */
  public async createLesson(userId: number, courseId: number, createLessonInput: CreateLessonInput) {
    const course = await this.course(courseId)
    return this.data.lesson.create({
      data: {
        course: {
          connect: { id: course.id },
        },
        ...createLessonInput,
      },
    })
  }

  public updateLesson(userId: number, lessonId: number, updateLessonInput: UpdateLessonInput) {
    return this.data.lesson.update({
      where: { id: lessonId },
      data: { ...updateLessonInput },
    })
  }
  //necesito pasarle un solo parametro el lessonId ya que el cliente es lesson
  public async deleteLesson(userId: number, lessonId: number) {
    const deleted = await this.data.lesson.delete({ where: { id: lessonId } })
    return !!deleted
  }
}
