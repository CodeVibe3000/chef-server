import { UserResolver } from "./controllers/UserResolver";
import { RecipeResolver } from "./controllers/RecipeResolver";
import { FeedResolver } from "./controllers/FeedResolver";
import { HomeResolver } from "./controllers/HomeResolver";

export const resolvers = [
    UserResolver,
    RecipeResolver,
    FeedResolver,
    HomeResolver
]