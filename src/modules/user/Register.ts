import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import bcrypt from 'bcryptjs';

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class RegisterResolver {
  
  @UseMiddleware(isAuth)
  @Query(() => String) 
  async hello() {
    return "Hello world!";
  }

  @Mutation(() => User)
  async register(@Arg('input') 
  {
    email, 
    firstName, 
    lastName, 
    password
  }: RegisterInput, @Ctx() ctx: MyContext): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();
    
    console.log(ctx.req.session)

    return user;
  }

}