import { User } from "../models/User"
import { compare, hash } from "bcryptjs";
import { createRefreshToken, createAccessToken } from "../auth/auth";
import { verify } from "jsonwebtoken";
import { MyContext } from "../other/MyContext";
import { getConnection } from "typeorm";

export class UserService{
    static async login
    (username:string, password:string) {
        const user = await User.findOne({ where: { username } });

        if (!user) {
        throw new Error("could not find user");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
        throw new Error("bad password");
        }

        // login successful


        return {
            accessToken: createAccessToken(user),
            refreshToken: createRefreshToken(user),
            user
        };
    }

    static async register (name:string, password:string, email:string, username:string) {
        const hashedPassword = await hash(password, 12);

        try {
        await User.insert({
            email,
            username,
            name,
            password: hashedPassword
        });
        } catch (err) {
        console.log(err);
        return false;
        }

        return true;
    }

    static async me (context:MyContext) {
        const authorization = context.req.headers["authorization"];

        if (!authorization) {
        return null;
        }

        try {
        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return User.findOne(payload.userId);
        } catch (err) {
        console.log(err);
        return null;
        }
    }

    static async revokeRefreshTokens(userId: number) {
        await getConnection()
        .getRepository(User)
        .increment({ id: userId }, "tokenVersion", 1);
  
        return true;
    }
}