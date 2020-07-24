import { Resolver, Mutation, UseMiddleware, Arg, Ctx, Query, Int } from "type-graphql";
import { isAuth } from "../auth/isAuth";
import { MyContext } from "../other/MyContext";
import { Recipe } from "../models/Recipe";
import { RecipeService } from "../services/recipe.service";
import { RecipeSection } from "../models/RecipeSection";


@Resolver()
export class RecipeResolver {
    @Mutation(() => Int)
    @UseMiddleware(isAuth)
    async createRecipe(
        @Arg("name") name: string,
        @Arg("description") description: string,
        @Arg("public") isPublic: boolean,
        @Ctx() context: MyContext
    ) {
        return RecipeService.createRecipe(context, name, description, isPublic)
    }

    @Query(() => Recipe)
    async getRecipeById(
        @Arg("id") id: number
    ) {
        return RecipeService.getRecipeById(id)
    }

    @Query(() => [Recipe])
    async searchRecipes(
        @Arg('q') q: string
    ) {
        return RecipeService.searchRecipes(q)
    }

    @Mutation(() => Int)
    @UseMiddleware(isAuth)
    async createSection(
        @Arg("id") id: number,
        @Arg("name") name: string
    ) {
        var section = await RecipeSection.insert({ recipeId:id, name })
        return section.identifiers[0].id
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async addIngredientsToRecipe(
        @Arg("ingredients", () => [String]) ingredients: string[],
        @Arg("id") id: number
    ) {
        return RecipeService.addIngredientsToRecipe(ingredients, id)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async addInstructionsToRecipe(
        @Arg("instructions", () => String) instructions: string,
        @Arg("id") id: number
    ) {
        return RecipeService.addInstructionsToRecipe(instructions, id)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async addInstructionsToSection(
        @Arg("instructions", () => [String]) instructions: string[],
        @Arg("id") id: number,
        @Arg("name") name: string
    ) {
        return RecipeService.addInstructionsToSection(instructions, id, name)
    }
}
  