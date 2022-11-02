import type {HydratedDocument, Types} from 'mongoose';
import type {StoreItem} from './model';
import StoreModel from './model';
import UserCollection from '../user/collection';
import { Store } from 'express-session';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class StoreItemCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the creator of the StoreItem
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<StoreItem>>} - The newly created store item
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, type: string): Promise<HydratedDocument<StoreItem>> {
    const date = new Date();
    const storeItem = new StoreModel({
      authorId,
      dateCreated: date,
      content,
      type,
      dateModified: date
    });
    await storeItem.save(); // Saves freet to MongoDB
    return storeItem.populate('authorId');
  }

  /**
   * Find a storeItem by storeItemId
   *
   * @param {string} storeItemId - The id of the freet to find
   * @return {Promise<HydratedDocument<StoreItem>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(storeItemId: Types.ObjectId | string): Promise<HydratedDocument<StoreItem>> {
    return StoreModel.findOne({_id: storeItemId}).populate('authorId');
  }

  /**
   * Get all the store items in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the store items
   */
  static async findAll(): Promise<Array<HydratedDocument<StoreItem>>> {
    // Retrieves freets and sorts them from most to least recent
    return StoreModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the store items in by given author
   *
   * @param {string} username - The username of author of the store item
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the store items
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<StoreItem>>> {
    const author = await UserCollection.findOneByUsername(username);
    return StoreModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a store item with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string, type: string): Promise<HydratedDocument<StoreItem>> {
    const storeItem = await StoreModel.findOne({_id: freetId});
    storeItem.content = content;
    storeItem.type = type;
    storeItem.dateModified = new Date();
    await storeItem.save();
    return storeItem.populate('authorId');
  }

  /**
   * Delete a store item with given storeItemId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(storeItemId: Types.ObjectId | string): Promise<boolean> {
    const freet = await StoreModel.deleteOne({_id: storeItemId});
    return freet !== null;
  }

  /**
   * Delete all the store items by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await StoreModel.deleteMany({authorId});
  }
}

export default StoreItemCollection;
