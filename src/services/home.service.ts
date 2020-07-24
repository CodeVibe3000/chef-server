import { MyContext } from "../other/MyContext";
import { Recipe } from "../models/Recipe";
import { User } from "../models/User";
import { getRepository, getConnection } from "typeorm";

export class HomeService {
    static async getMyRecipes(ctx: MyContext) {
        var userId = ctx.payload!.userId

        var recipes = await Recipe.find({ where: {
            creatorId: userId
        }, order:{id:"DESC"} })

        for(var recipe of recipes){
            var user = await User.findOne({ id: recipe!.creatorId })
            recipe!.user = user!;
        }
        
        return recipes
    }

    static async rename(name:string, description:string, id:number) {
        const repo = getRepository(Recipe);
        const recipe = await repo.findOne(id)
        recipe!.name = name
        recipe!.description = description
        repo.save(recipe!)
    }

    static async addImgUrl(id: number, url: string) {
        var repo = getConnection().getRepository(Recipe)
        var recipe = await repo.findOne({id})
        recipe!.imgUrl = url
        recipe!.save()
        return true
    }

    static async publishRecipe(id: number) {
        var repo = getConnection().getRepository(Recipe)
        var recipe = await repo.findOne({id})
        recipe!.published = true
        recipe!.save()
        return true 
    }
}