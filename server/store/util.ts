import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import {StoreItem, PopulatedStoreItem } from './model';

// Update this if you add a property to the Store Item type!
type StoreResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Store Item object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {StoreResponse} - The freet object formatted for the frontend
 */
const constructStoreItemResponse = (item: HydratedDocument<StoreItem>): StoreResponse => {
  const itemCopy: PopulatedStoreItem = {
    ...item.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = itemCopy.authorId;
  delete itemCopy.authorId;
  return {
    ...itemCopy,
    _id: itemCopy._id.toString(),
    author: username,
    dateCreated: formatDate(item.dateCreated),
    dateModified: formatDate(item.dateModified)
  };
};

export {
  constructStoreItemResponse
};
