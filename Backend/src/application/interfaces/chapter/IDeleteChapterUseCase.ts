export interface IDeleteChapterUseCase{
    execute(
        chapterId:string,
        teacherId:string,
    ):Promise<void>
}