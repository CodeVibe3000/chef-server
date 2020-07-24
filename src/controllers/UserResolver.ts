import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  Int,
  UseMiddleware
} from "type-graphql";
import { User } from "../models/User";
import { MyContext } from "../other/MyContext";
import { UserService } from "../services/user.service";
import { isAuth } from "../auth/isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello!";
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  me(@Ctx() context: MyContext) {
    return UserService.me(context)
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    return UserService.revokeRefreshTokens(userId)
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
  ): Promise<LoginResponse> {
    return UserService.login(username, password)
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string,
    @Arg("name") name: string
  ) {
    return UserService.register(name, password, email, username)
  }
}
