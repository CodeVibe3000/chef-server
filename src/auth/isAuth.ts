import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "../other/MyContext";

// bearer 102930ajslkdaoq01 

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    context.res.sendStatus(401)
    throw new Error("not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (err) {
    var error = (err.toString());
    if(error == "TokenExpiredError: jwt expired"){
      context.res.sendStatus(403)
    }else{
      context.res.sendStatus(401)
    }
    throw new Error("not auth")
  }

  return next();
};
