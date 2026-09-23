import { CreateCategoryUseCase } from "../../application/use-cases/category/CreateCategoryUseCase";
import { CreateCategoryController } from "../../presentation/controllers/category/CreateCategoryController";

import { categoryRepository } from "./repositoryDependencies";

export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

export const createCategoryController = new CreateCategoryController(createCategoryUseCase);