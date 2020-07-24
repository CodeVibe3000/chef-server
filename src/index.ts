import "dotenv/config";
import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import * as cors from "cors";
import { User } from "./models/User";
import { createAccessToken, createRefreshToken } from "./auth/auth";
import { resolvers } from "./resolvers";
import { router } from "./other/router";
import * as path from "path"
import { Recipe } from "./models/Recipe";
import { RecipeSection } from "./models/RecipeSection";


(async () => {
  const app = express();
  app.use(
    cors({
      origin: ["https://chefapp.netlify.app", "http://localhost:3000", "https://mychef.netlify.app"],
      credentials: true
    })
  );


  app.use("/foodImages", express.static(path.join(__dirname,"../uploads/")))
  app.use(express.urlencoded({ extended:true }))
  app.get("/", (_req, res) => res.send("hello"));
  app.post("/refresh_token", async (req, res) => {
    const token = req.header("refresh");
    console.log(token)
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    // token is valid and
    // we can send back an access token
    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    return res.send({ ok: true, accessToken: createAccessToken(user), refreshToken:createRefreshToken(user) });
  });
  
  process.env.NODE_ENV == "development" ? await createConnection() : await createConnection({
    type:"postgres",
    url:process.env.DATABASE_URL,
    entities:[User, Recipe, RecipeSection],
    synchronize: true
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: resolvers
    }),
    playground: true,
    introspection: true,
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.use(router)

  app.listen(process.env.PORT || 4000, () => {
    console.log("Server Started at http://localhost:4000/graphql");
  });
})();

