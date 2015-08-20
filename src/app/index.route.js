function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/index.html',
      controller: 'MainController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}

export default routerConfig;
