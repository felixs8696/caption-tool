/* global malarkey:false, toastr:false, moment:false */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _indexConfig = require('./index.config');

var _indexConfig2 = _interopRequireDefault(_indexConfig);

var _indexRoute = require('./index.route');

var _indexRoute2 = _interopRequireDefault(_indexRoute);

var _indexRun = require('./index.run');

var _indexRun2 = _interopRequireDefault(_indexRun);

var _mainMainController = require('./main/main.controller');

var _mainMainController2 = _interopRequireDefault(_mainMainController);

var _appComponentsNavbarNavbarDirective = require('../app/components/navbar/navbar.directive');

var _appComponentsNavbarNavbarDirective2 = _interopRequireDefault(_appComponentsNavbarNavbarDirective);

angular.module('captionTool', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap']).constant('moment', moment).constant('MaxCharPerLine', 32).config(_indexConfig2['default']).config(_indexRoute2['default']).run(_indexRun2['default']).controller('MainController', _mainMainController2['default']).directive('acmeNavbar', function () {
  return new _appComponentsNavbarNavbarDirective2['default']();
});

//# sourceMappingURL=index.module-compiled.js.map