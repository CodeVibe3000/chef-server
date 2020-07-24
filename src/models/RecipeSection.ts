import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("recipe_section")
export class RecipeSection extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column("int")
  recipeId: number

  @Field()
  @Column("text")
  name: string;

  @Field(() => [String], { nullable:true })
  @Column("text", { array:true, nullable:true })
  instructions: string[]

}
