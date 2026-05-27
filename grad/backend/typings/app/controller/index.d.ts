// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAdmin = require('../../../app/controller/admin');
import ExportAuth = require('../../../app/controller/auth');
import ExportBudget = require('../../../app/controller/budget');
import ExportCategory = require('../../../app/controller/category');
import ExportChat = require('../../../app/controller/chat');
import ExportHome = require('../../../app/controller/home');
import ExportReport = require('../../../app/controller/report');
import ExportSearch = require('../../../app/controller/search');
import ExportShare = require('../../../app/controller/share');
import ExportTag = require('../../../app/controller/tag');
import ExportTransaction = require('../../../app/controller/transaction');

declare module 'egg' {
  interface IController {
    admin: ExportAdmin;
    auth: ExportAuth;
    budget: ExportBudget;
    category: ExportCategory;
    chat: ExportChat;
    home: ExportHome;
    report: ExportReport;
    search: ExportSearch;
    share: ExportShare;
    tag: ExportTag;
    transaction: ExportTransaction;
  }
}
