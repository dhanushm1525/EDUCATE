import { Lesson } from "../../entities/Lesson";

export interface ILessonRepository{
    create(lesson:Lesson):Promise<Lesson>

    findById(lessonId:string):Promise<Lesson | null>

    findByChapterId(chapterId:string):Promise<Lesson[]>

    update(lessonId:string,lesson:Partial<Lesson>):Promise<Lesson | null>

    delete(lessonId:string):Promise<boolean>
}