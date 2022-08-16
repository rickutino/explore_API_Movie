import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { connection as knex} from "../database/knex";

class NotesController {
  async index(request: Request, response: Response): Promise<Response> {
    const { user_id, title, tags } = request.query;

    let notes;

    if (tags && title) {
      const filterTags = (tags as string).split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.description",
          "notes.rating",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title")
    } else if (tags) {
      const filterTags = (tags as string).split(',').map(tag => tag.trim());
      
      notes = await knex("tags")
        .select([
          "notes.id",
          "notes.title",
          "notes.description",
          "notes.rating",
          "notes.user_id",
        ])
        .where("notes.user_id", user_id)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title")
    } else if (title) {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .orderBy("title");
    }
    
    const userTags = await knex("tags").where({ user_id });
    const notesWithTags = notes.map (note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });

    return response.status(200).json(notesWithTags);
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { title, description, tags, rating } = request.body;
    const { user_id } = request.params;

    const note_id = await knex("notes").insert({
      title,
      description,
      user_id,
      rating
    });

    const tagsInsert = tags.map((name: {note_id: number, user_id: number, name: string[]}) => {
      return {
        note_id,
        user_id,
        name
      }
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");

    if (!note) {
      throw new AppError("This id not found")
    };

    return response.json([{
      ...note,
      tags
    }]);
  }

  async delete(request: Request, response: Response): Promise<void> {
    const { id } = request.params;

    const deleteNote = await knex("notes").where({ id }).delete();

    if (!deleteNote) {
      throw new AppError("This id not found")
    };

    response.status(204).json()
  }
}

export { NotesController };