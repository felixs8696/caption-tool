/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import runBlock from './index.run';
import MainController from './main/main.controller';
import NavbarDirective from '../app/components/navbar/navbar.directive';

angular.module('captionTool', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .constant('moment', moment)
  .constant('MaxCharPerLine', 32)
  .config(config)

  .config(routerConfig)

  .run(runBlock)
  .controller('MainController', MainController)
  .directive('acmeNavbar', () => new NavbarDirective());
