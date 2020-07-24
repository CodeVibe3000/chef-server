import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg } from "type-graphql";
import { isAuth } from "../auth/isAuth";
import { MyContext } from "../other/MyContext";
import { HomeService } from "../services/home.service";
import { Recipe } from "../models/Recipe";

@Resolver()
export class HomeResolver {
    @Query(() => [Recipe])
    @UseMiddleware(isAuth)
    getMyRecipes(@Ctx() ctx: MyContext) {
        return HomeService.getMyRecipes(ctx)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    renameRecipe(
        @Arg("name") name: string,
        @Arg("description") description: string,
        @Arg("id") id: number
    ) {
        HomeService.rename(name, description, id)
        return true
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    addImgUrl(
        @Arg("id") id: number,
        @Arg("url") url: string
    ){
        return HomeService.addImgUrl(id, url)
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    publishRecipe(
        @Arg("id") id: number
    )
    {
        return HomeService.publishRecipe(id)
    }
}