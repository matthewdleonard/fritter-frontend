import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import {Lock, PopulatedLock } from './model';

// Update this if you add a property to the Store Item type!
type LockResponse = {
  _id: string;
  author: string;
  type: string;
  browseTimeLeft: string;
  activityTimeLeft: string;
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
const constructLockResponse = (item: HydratedDocument<Lock>): LockResponse => {
  const itemCopy: PopulatedLock = {
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
    dateModified: formatDate(item.dateModified)
  };
};

export {
  constructLockResponse
};
