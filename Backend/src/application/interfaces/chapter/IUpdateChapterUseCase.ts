import { Chapter } from "../../../domain/entities/Chapter";
import { UpdateChapterDTO } from "../../dtos/chapter/UpdateChapterDTO";

export interface IUpdateChapterUseCase{
    execute(
        chapterId:string,
        teacherId:string,
        dto:UpdateChapterDTO,
    ):Promise<Chapter>
}