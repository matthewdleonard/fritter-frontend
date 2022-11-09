import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LockCollection from './collection';

/**
 * Checks if a freet with lockId is req.params exists
 */
const isLockExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.lockId);
  const lock = validFormat ? await LockCollection.findOne(req.params.lockId) : '';
  if (!lock) {
    res.status(404).json({
      error: {
        lockNotFound: `Lock with ID ${req.params.lockId} does not exist.`
      }
    });
    return;
  }

  next();
};


/**
 * Checks if the lock update has the correct parameters and they are formatted as numbers
 */
 const isValidLockContent = async (req: Request, res: Response, next: NextFunction) => {
  const {browseTimeLeft} = req.body as {browseTimeLeft: string};
  const {activityTimeLeft} = req.body as {activityTimeLeft: string};

  const {type} = req.body as {type: string};
    if (!type.trim()) {
      res.status(400).json({
        error: 'Lock type must be at least one character long.'
      });
      return;
    }

    if (Number(browseTimeLeft) == NaN) {
      res.status(400).json({
        error: 'Lock time must be a number.'
      });
      return;
    }

    if (Number(activityTimeLeft) == NaN) {
      res.status(400).json({
        error: 'Lock time must be a number.'
      });
      return;
    }


  next();
};
/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidLockModifier = async (req: Request, res: Response, next: NextFunction) => {
  const lock = await LockCollection.findOne(req.params.lockId);
  const userId = lock.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' locks.'
    });
    return;
  }

  next();
};

export {
  isLockExists,
  isValidLockModifier,
  isValidLockContent
};
