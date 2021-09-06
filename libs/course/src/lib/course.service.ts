import { Injectable } from '@nestjs/common'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { Course } from './models/course'
import { CreateLessonInput } from './dto/create-lesson.input'
import { Lesson } from './models/lesson'
import { UpdateLessonInput } from './dto/update-lesson.input'

//SERVICE SIN USAR PRISMA CLIENT CON METODOS "MANUALES"
@Injectable()
export class CourseService {
  items: Course[] = [
    {
      id: '123',
      title: 'intro-to-graphql',
      description: 'Introduction to Graphql',
      lessons: [
        { id: 'lesson-1', title: 'introduction to the course', content: 'hello world' },
        { id: 'lesson-2', title: 'lesson 1', content: 'hello students' },
        { id: 'lesson-2', title: 'lesson 2', content: 'get busy' },
      ],
    },
    {
      id: '111',
      title: 'intro-to-nest',
      description: 'Introduction to nest',
      lessons: [
        { id: 'lesson-1', title: 'introduction to nest', content: 'hello world' },
        { id: 'lesson-2', title: 'lesson 1', content: 'hello students' },
        { id: 'lesson-2', title: 'lesson 2', content: 'get busy' },
      ],
    },
    {
      id: '102',
      title: 'intro-to-javascript',
      description: 'Introduction to Javascript',
      lessons: [
        { id: 'lesson-1', title: 'introduction to JAVSCRIPT', content: 'hello world' },
        { id: 'lesson-2', title: 'lesson 1', content: 'hello students' },
        { id: 'lesson-2', title: 'lesson 2', content: 'get busy' },
      ],
    },
  ]
  //inicialmente hardcodeado!

  public courses() {
    return this.items
  }
  public course(id: string) {
    return this.items.find((item) => item.id === id)
  }
  public createCourse(createCourseInput: CreateCourseInput) {
    const newCourse: Course = {
      id: Date.now().toString(),
      ...createCourseInput,
    }
    this.items.push(newCourse)
    return newCourse
  }
  //HAGO UNA COPIA DEL COURSE ENCONTRAOD POR ID Y LUEGO UPDETEO HACIENDO UNA COPIA DE LO QUE ME LLEGA POR PARAMETRO QUE ES updateCourseInput
  //ahora a this.items DEBO PISARLO usando un map a items PARA ACTUALIZAR EL COURSE QUE FUE MODIFICADO!!!
  public updateCourse(id: string, updateCourseInput: UpdateCourseInput, lessons?: Lesson[]) {
    const foundCourseToUpdate: Course = this.course(id)
    const updatedCourse: Course = {
      ...foundCourseToUpdate,
      ...updateCourseInput,
      lessons: lessons ? lessons : foundCourseToUpdate.lessons,
      //para poder reutilizarlo en createLesson()
    }

    this.items = this.items.map((item) => (item.id === id ? updatedCourse : item))

    //console.log(this.items);
    return updatedCourse
  }

  public deleteCourse(id: string) {
    if (!this.course(id)) {
      return false
    }
    this.items = this.items.filter((item) => item.id !== id)
    return true
  }
  /**
   * createLesson
   * reutilizo el metodo course() para encontrar el course en el cual voy a agregar los lessons
   * VOY A REUTILIZAR EL METODO public updateCourse pasando estos nuevos parametros que me llegan del resolver      correspondiente!!
   */
  public createLesson(courseId: string, createLessonInput: CreateLessonInput) {
    const newLesson = {
      id: Date.now().toString(),
      ...createLessonInput,
    }
    const course = this.course(courseId)
    this.updateCourse(courseId, {}, [...course.lessons, newLesson])
    return newLesson
  }
  /**
   * updateLesson: primero busco el course con el metodo course(), luego busco el lesson dentro de course usando el lessonId, voy a usar find() dentro de course.lessons, Finalmente actualizo el lesson encontrado usando el updateLessonInput desestructurando el lesson inicialmente encontrado y AGREGANDO ...updateLessonInput
   * Finalmente debo PISAR course.lessons usando el map: si el item.id es igual al id que llega por parametro retorno el la instancia del item actualizado y luego para el resto de los items retorno el mismo item
   */
  public updateLesson(courseId: string, lessonId: string, updateLessonInput: UpdateLessonInput) {
    const course = this.course(courseId)
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId)

    const updatedLesson: Lesson = {
      ...lesson,
      ...updateLessonInput,
    }

    course.lessons = course.lessons.map((lesson) => {
      if (lesson.id === lessonId) return updatedLesson
      return lesson
    })
    /*
    alternativa usar ternario
    course.lessons = course.lessons.map(lesson => lesson.id === lessonId ? updatedLesson : lesson)
    */

    return updatedLesson
  }
  /**
   * deleteLesson: si no encuentro el course por id retorno false; si no encuentro lesson por id tb retorno false, DEBO FILTRAR COURSE.LESSONS AHORA Y PISAR COURSE.LESSONS
   */
  public deleteLesson(courseId: string, lessonId: string) {
    const course = this.course(courseId)
    if (!course) return false
    const lesson = course.lessons.find((lesson) => lesson.id === lessonId)
    if (!lesson) return false

    course.lessons = course.lessons.filter((lesson) => lesson.id !== lessonId)
    return true
  }
}

/*
mutation {
  deleteCourse(id:"102") 
}
*/
