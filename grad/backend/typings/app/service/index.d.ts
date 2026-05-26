// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBudget = require('../../../app/service/budget');
import ExportCategory = require('../../../app/service/category');
import ExportReport = require('../../../app/service/report');
import ExportSearch = require('../../../app/service/search');
import ExportTag = require('../../../app/service/tag');
import ExportTransaction = require('../../../app/service/transaction');
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    budget: AutoInstanceType<typeof ExportBudget>;
    category: AutoInstanceType<typeof ExportCategory>;
    report: AutoInstanceType<typeof ExportReport>;
    search: AutoInstanceType<typeof ExportSearch>;
    tag: AutoInstanceType<typeof ExportTag>;
    transaction: AutoInstanceType<typeof ExportTransaction>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
