import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';

/**
 * Checks if a freet with freetId is req.params exists
 */

/**
 * Checks if the content of the message in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidMessageContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Message content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Message content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */

export {
  isValidMessageContent,
};
