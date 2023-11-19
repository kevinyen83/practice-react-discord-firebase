// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    teardown: { destroyAfterEach: false },
    // Add next 2 lines with upgrade to angualr 14
    // errorOnUnknownElements: true,
    // errorOnUnknownProperties: true
  }
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// https://github.com/angular/angular/issues/36430
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (data: any) => fail(data);
