// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAdmin = require('../../../app/service/admin');
import ExportBudget = require('../../../app/service/budget');
import ExportCategory = require('../../../app/service/category');
import ExportReport = require('../../../app/service/report');
import ExportSearch = require('../../../app/service/search');
import ExportShare = require('../../../app/service/share');
import ExportTag = require('../../../app/service/tag');
import ExportTransaction = require('../../../app/service/transaction');
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    admin: AutoInstanceType<typeof ExportAdmin>;
    budget: AutoInstanceType<typeof ExportBudget>;
    category: AutoInstanceType<typeof ExportCategory>;
    report: AutoInstanceType<typeof ExportReport>;
    search: AutoInstanceType<typeof ExportSearch>;
    share: AutoInstanceType<typeof ExportShare>;
    tag: AutoInstanceType<typeof ExportTag>;
    transaction: AutoInstanceType<typeof ExportTransaction>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
