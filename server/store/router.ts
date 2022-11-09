import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import StoreItemCollection from './collection';
import * as userValidator from '../user/middleware';
import * as storeItemValidator from '../store/middleware';
import * as util from './util';

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

    const allStoreItems = await StoreItemCollection.findAll();
    const response = allStoreItems.map(util.constructStoreItemResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorItems = await StoreItemCollection.findAllByUsername(req.query.author as string);
    const response = authorItems.map(util.constructStoreItemResponse);
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
    storeItemValidator.isValidStoreItemContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const storeItem = await StoreItemCollection.addOne(userId, req.body.content, req.body.type);

    res.status(201).json({
      message: 'Your store item was created successfully.',
      storeItem: util.constructStoreItemResponse(storeItem)
    });
  }
);

/**
 * Delete a store item
 *
 * @name DELETE /api/store/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the store item
 * @throws {404} - If the storeItemId is not valid
 */
router.delete(
  '/:storeItemId?',
  [
    userValidator.isUserLoggedIn,
    storeItemValidator.isStoreItemExists,
    storeItemValidator.isValidStoreItemModifier
  ],
  async (req: Request, res: Response) => {
    await StoreItemCollection.deleteOne(req.params.storeItemId);
    res.status(200).json({
      message: 'Your store item was deleted successfully.'
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
  '/:storeItemId?',
  [
    userValidator.isUserLoggedIn,
    storeItemValidator.isStoreItemExists,
    storeItemValidator.isValidStoreItemModifier,
    storeItemValidator.isValidStoreItemContent
  ],
  async (req: Request, res: Response) => {
    const storeItem = await StoreItemCollection.updateOne(req.params.storeItemId, req.body.content, req.body.type);
    res.status(200).json({
      message: 'Your store item was updated successfully.',
      storeItem: util.constructStoreItemResponse(storeItem)
    });
  }
);

export {router as storeRouter};
