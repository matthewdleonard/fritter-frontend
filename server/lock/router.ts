import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import StoreItemCollection from './collection';
import * as userValidator from '../user/middleware';
import * as lockValidator from './middleware';
import * as util from './util';
import LockCollection from './collection';

const router = express.Router();

/**
 * Get all the store items
 *
 * @name GET /api/storeItems
 *
 * @return {StoreResponse[]} - A list of all the storeItems sorted in descending
 *                      order by date modified
 */

/**
 * Get store items by author.
 *
 * @name GET /api/storeItems?authorId=id
 *
 * @return {StoreResponse[]} - An array of storeItems created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allLocks = await StoreItemCollection.findAll();
    const response = allLocks.map(util.constructLockResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorLocks = await StoreItemCollection.findAllByUsername(req.query.author as string);
    const response = authorLocks.map(util.constructLockResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new storeItem.
 *
 * @name POST /api/store
 *
 * @param {string} content - The content of the store item
 * @param {string} type - The type of the store item
 * @return {StoreItemResponse} - The created store item
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the store content is empty or a stream of empty spaces
 * @throws {413} - If the store content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    lockValidator.isValidLockContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const lock = await LockCollection.addOne(userId, req.body.type);

    res.status(201).json({
      message: 'Your lock was created successfully.',
      storeItem: util.constructLockResponse(lock)
    });
  }
);

/**
 * Delete a lock
 *
 * @name DELETE /api/store/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the store item
 * @throws {404} - If the lockId is not valid
 */
router.delete(
  '/:lockId?',
  [
    userValidator.isUserLoggedIn,
    lockValidator.isLockExists,
    lockValidator.isValidLockModifier,
  ],
  async (req: Request, res: Response) => {
    await StoreItemCollection.deleteOne(req.params.lockId);
    res.status(200).json({
      message: 'Your lock was deleted successfully.'
    });
  }
);

/**
 * Modify a store item
 *
 * @name PUT /api/store/:id
 *
 * @param {string} content - the new content for the storeItem
 * @return {StoreItemResponse} - the updated storeItem
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the storeItem
 * @throws {404} - If the storeItem is not valid
 */
router.put(
  '/:lockId?',
  [
    userValidator.isUserLoggedIn,
    lockValidator.isLockExists,
    lockValidator.isValidLockContent,
    lockValidator.isValidLockModifier,
  ],
  async (req: Request, res: Response) => {
    const storeItem = await StoreItemCollection.updateOne(req.params.lockId, req.body.browseTimeLeft, req.body.activityTimeLeft);
    res.status(200).json({
      message: 'Your lock was updated successfully.',
      storeItem: util.constructLockResponse(storeItem)
    });
  }
);

export {router as lockRouter};
