import type {HydratedDocument, Types} from 'mongoose';
import type {Lock} from './model';
import LockModel from './model';
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
class LockCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the user the lock belongs to
   * @param {string} type - The type of lock it is
   * @return {Promise<HydratedDocument<Lock>>} - The newly created lock
   */
  static async addOne(authorId: Types.ObjectId | string, type: string): Promise<HydratedDocument<Lock>> {
    let date = new Date();
    const lock = new LockModel({
      authorId,
      type,
      browseTimeLeft: 3600.0,
      activityTimeLeft: 1200.0,
      dateModified: date
    });
    await lock.save(); // Saves freet to MongoDB
    return lock.populate('authorId');
  }

  /**
   * Find a lock by lockId
   *
   * @param {string} lockId - The id of the lock to find
   * @return {Promise<HydratedDocument<Lock>> | Promise<null> } - The lock with the given lockId, if any
   */
  static async findOne(lockId: Types.ObjectId | string): Promise<HydratedDocument<Lock>> {
    return LockModel.findOne({_id: lockId}).populate('authorId');
  }

  /**
   * Get all the locks in the database
   *
   * @return {Promise<HydratedDocument<Lock>[]>} - An array of all of the locks
   */
  static async findAll(): Promise<Array<HydratedDocument<Lock>>> {
    // Retrieves freets and sorts them from most to least recent
    return LockModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the locks by given author
   *
   * @param {string} username - The username of author of the lock
   * @return {Promise<HydratedDocument<Lock>[]>} - An array of all of the locks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Lock>>> {
    const author = await UserCollection.findOneByUsername(username);
    return LockModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a lock with the new content
   *
   * @param {string} lockId - The id of the freet to be updated
   * @param {string} type - The new type
   * @return {Promise<HydratedDocument<Lock>>} - The newly updated freet
   */
  static async updateOne(lockId: Types.ObjectId | string, browseTimeLeft: string, activityTimeLeft: string): Promise<HydratedDocument<Lock>> {
    const lock = await LockModel.findOne({_id: lockId});
    lock.dateModified = new Date();
    lock.browseTimeLeft = browseTimeLeft;
    lock.activityTimeLeft = activityTimeLeft;

    await lock.save();
    return lock.populate('authorId');
  }

  /**
   * Delete a lock with given lockId.
   *
   * @param {string} lockId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(lockId: Types.ObjectId | string): Promise<boolean> {
    const lock = await LockModel.deleteOne({_id: lockId});
    return lock !== null;
  }

  /**
   * Delete all the locks by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await LockModel.deleteMany({authorId});
  }
}

export default LockCollection;
