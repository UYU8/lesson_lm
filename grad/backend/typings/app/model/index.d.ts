// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportBudget = require('../../../app/model/budget');
import ExportCategory = require('../../../app/model/category');
import ExportChatMessage = require('../../../app/model/chat-message');
import ExportRefreshToken = require('../../../app/model/refresh-token');
import ExportSearchHistory = require('../../../app/model/search-history');
import ExportTag = require('../../../app/model/tag');
import ExportTransactionTag = require('../../../app/model/transaction-tag');
import ExportTransaction = require('../../../app/model/transaction');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    Budget: ReturnType<typeof ExportBudget>;
    Category: ReturnType<typeof ExportCategory>;
    ChatMessage: ReturnType<typeof ExportChatMessage>;
    RefreshToken: ReturnType<typeof ExportRefreshToken>;
    SearchHistory: ReturnType<typeof ExportSearchHistory>;
    Tag: ReturnType<typeof ExportTag>;
    TransactionTag: ReturnType<typeof ExportTransactionTag>;
    Transaction: ReturnType<typeof ExportTransaction>;
    User: ReturnType<typeof ExportUser>;
  }
}
