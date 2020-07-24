import { getConnection } from "typeorm";
import { Recipe } from "../models/Recipe";
import { User } from "../models/User";

export class FeedService {
    static async getRecipeByLimit(limit: number) {
        const recipes =  (await getConnection()
            .getRepository(Recipe)
            .createQueryBuilder("recipe")
            .orderBy("recipe.id", "DESC")
            .where("recipe.published = true")
            .andWhere("recipe.public = true")
            .limit(limit)
            .getMany())
        for(var recipe of recipes){
            var user = await User.findOne({ id: recipe!.creatorId })
            recipe!.user = user!;
        }
        return recipes
    }
}