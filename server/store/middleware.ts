import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import StoreItemCollection from '../store/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isStoreItemExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.storeItemId);
  const storeItem = validFormat ? await StoreItemCollection.findOne(req.params.storeItemId) : '';
  if (!storeItem) {
    res.status(404).json({
      error: {
        storeItemNotFound: `Store Item with ID ${req.params.storeItem} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidStoreItemContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  const {type} = req.body as {type: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Store Item content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Store Item content must be no more than 140 characters.'
    });
    return;
  }


  if (!type.trim()) {
    res.status(400).json({
      error: 'Store Item type must be at least one character long.'
    });
    return;
  }

  if (type.length > 16) {
    res.status(413).json({
      error: 'Store Item type must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidStoreItemModifier = async (req: Request, res: Response, next: NextFunction) => {
  const storeItem = await StoreItemCollection.findOne(req.params.storeItemId);
  const userId = storeItem.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' store items.'
    });
    return;
  }

  next();
};

export {
  isValidStoreItemContent,
  isStoreItemExists,
  isValidStoreItemModifier
};
