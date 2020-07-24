import { Resolver, Query, Arg } from "type-graphql";
import { Recipe } from "../models/Recipe";
import { FeedService } from "../services/feed.service";

@Resolver()
export class FeedResolver{

    @Query(() => [Recipe])
    async getNewestRecipes(
        @Arg("limit") limit: number
    ){
        return FeedService.getRecipeByLimit(limit)
    }



}