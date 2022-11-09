import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Message on the backend
export type Message = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  recipientId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

export type PopulatedMessage = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  recipientId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const MessageSchema = new Schema<Message>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The author userId
  recipientId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});

const MessageModel = model<Message>('Message', MessageSchema);
export default MessageModel;
