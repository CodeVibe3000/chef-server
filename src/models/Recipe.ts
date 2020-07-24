import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { RecipeSection } from "./RecipeSection";
import { User } from "./User";

@ObjectType()
@Entity("recipes")
export class Recipe extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  creatorId: number

  @Field()
  @Column("text")
  name: string;

  @Field()
  @Column({ default:false })
  published: boolean

  @Field()
  @Column({ default: true })
  public: boolean

  @Field()
  @Column("text")
  description: string;

  @Field({ nullable:true })
  @Column("text", { nullable:true })
  imgUrl: string

  @Field(() => [String], { nullable:true })
  @Column("text", { array:true, nullable:true })
  ingredients: string[]

  @Field(() => String, { nullable:true })
  @Column("text", { nullable:true })
  instructions: string

  @Field(() => [RecipeSection], {nullable:true})
  sections: RecipeSection[]

  @Field(() => User)
  user: User

}
