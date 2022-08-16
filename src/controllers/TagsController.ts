import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { connection as knex} from "../database/knex";

class TagsController {
  async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const tags = await knex("tags").where({ user_id });
    
    return response.json(tags);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { title, description, tags } = request.body;
    const { user_id } = request.params;

    const tag_id = await knex("tags").insert({
      title,
      description,
      user_id
    });

    const tagsInsert = tags.map((name: {tag_id: number, user_id: number, name: string[]}) => {
      return {
        tag_id,
        user_id,
        name
      }
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const tag = await knex("tags").where({ id }).first();
    const tags = await knex("tags").where({ tag_id: id }).orderBy("name");

    if (!tag) {
      throw new AppError("This id not found")
    };

    return response.json([{
      ...tag,
      tags
    }]);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const deleteTag = await knex("tags").where({ id }).delete();

    if (!deleteTag) {
      throw new AppError("This id not found")
    };

    response.status(204).json()
  }
}

export { TagsController };