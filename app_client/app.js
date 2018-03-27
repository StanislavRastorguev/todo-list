angular.module('todoListApp', ['ui.router', 'ui.utils'])
  .config(($stateProvider, $urlRouterProvider, $locationProvider) => {
    $stateProvider
      .state('/', {
        url: '/',
        templateUrl: '/home/home.template.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
