import { MyContext } from "../other/MyContext"
import { Recipe } from "../models/Recipe"
import { Response } from "express";
import { getConnection } from "typeorm";
import { RecipeSection } from "../models/RecipeSection";
import { User } from "../models/User";

export class RecipeService {
    static async createRecipe(context: MyContext, name:string, description:string, isPublic: boolean) {
        var creatorId:number = context.payload!.userId

        const recipe = await Recipe.insert({
            creatorId,
            name,
            description,
            public:isPublic
        })
        var id = recipe.identifiers[0].id
        return id
    }

    static async getRecipeById(id:number) {
        const sections = await RecipeSection.find({ where: { recipeId:id } })

        var recipe = await Recipe.findOne({ id })

        var user = await User.findOne({ id: recipe!.creatorId })

        recipe!.sections = sections
        recipe!.user = user!

        return recipe
    }

    static async searchRecipes(q:string) {
        const words = q.split(" ")
        var query = "SELECT * FROM recipes WHERE published=true AND public=true AND "
        for(var word of words) {
            query += "lower(name) LIKE lower('%"+word+"%') "
            if(word != words[words.length - 1]){
                query += "AND "
            }
        }
        query += " ORDER BY id DESC"
        const recipes = await Recipe.query(query)
        for(var recipe of recipes){
            var user = await User.findOne({ id: recipe!.creatorId })
            recipe!.user = user!;
        }
        return recipes
    }


    static async addImageToRecipe(req:any, res:Response) {
        var recipeId = req.body.recipeId
        var repo = getConnection().getRepository(Recipe)
        var recipe = await repo.findOne({id:recipeId})
        recipe!.imgUrl = req.file.path.replace("https://", "")
        recipe!.save()
        res.redirect("http://localhost:3000/dashboard")
        return "Created"
    }

    static async addIngredientsToRecipe(ingredients: string[], recipeId: number){
        var repo = getConnection().getRepository(Recipe)
        var recipe = await repo.findOne({id:recipeId})
        recipe!.ingredients = ingredients
        recipe!.save()
        return true
    }

    static async addInstructionsToRecipe(instructions: string, recipeId: number){
        var repo = getConnection().getRepository(Recipe)
        var recipe = await repo.findOne({id:recipeId})
        recipe!.instructions = instructions
        recipe!.save()
        return true
    }

    static async addInstructionsToSection(instructions: string[], recipeId: number, sectionName: string){
        var section = (await RecipeSection.find({where:{name:sectionName, recipeId}}))[0]
        section!.instructions = instructions
        section!.save()
        return true
    }
}

