import type {HydratedDocument, Types} from 'mongoose';
import type {Message} from './model';
import MessageModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class MessageCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} senderId - The id of the author of the message
   * @param {string} content - The id of the content of the message
   * @return {Promise<HydratedDocument<Message>>} - The newly created message
   */
  static async addOne(authorId: Types.ObjectId | string, recipientName: string, content: string): Promise<HydratedDocument<Message>> {
    const date = new Date();
    
    const user = await UserCollection.findOneByUsername(recipientName);
    if (!user) {
      return;
    }
    const recipientId = user?._id.toString();

    const message = new MessageModel({
      authorId,
      recipientId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await message.save(); // Saves freet to MongoDB
    return message.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} messageId - The id of the message to find
   * @return {Promise<HydratedDocument<Message>> | Promise<null> } - The message with the given messageId, if any
   */
  static async findOne(messageId: Types.ObjectId | string): Promise<HydratedDocument<Message>> {
    return MessageModel.findOne({_id: messageId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Message>[]>} - An array of all of the freets
   */
  static async findAll(username: string): Promise<Array<HydratedDocument<Message>>> {
    // Retrieves freets and sorts them from most to least recent
    return MessageModel.find({recipientId: username}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the messages
   * @return {Promise<HydratedDocument<Message>[]>} - An array of all of the messages
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Message>>> {
    const author = await UserCollection.findOneByUsername(username);
    return MessageModel.find({authorId: author._id}).populate('authorId');
  }
}

export default MessageCollection;
