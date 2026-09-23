import { CreateCategoryUseCase } from "../../application/use-cases/category/CreateCategoryUseCase";
import { CreateCategoryController } from "../../presentation/controllers/category/CreateCategoryController";

import { categoryRepository } from "./repositoryDependencies";

import { GetCategoriesUseCase } from "../../application/use-cases/category/GetCategoriesUseCase";
import { GetCategoriesController } from "../../presentation/controllers/category/GetCategoriesController";


export const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

export const createCategoryController = new CreateCategoryController(createCategoryUseCase);

export const getCategoriesUseCase =
    new GetCategoriesUseCase(categoryRepository);

export const getCategoriesController =
    new GetCategoriesController(getCategoriesUseCase);