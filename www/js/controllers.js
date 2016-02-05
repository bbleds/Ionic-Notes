angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.factory('localStore', function(){
    //private variables
    var titleName;
    return{
      setLocalStorage : function(key,value){
        //if object doesnt exist in local storage create it
        if(localStorage.BAMSnoteHistory === undefined){
              localStorage.BAMSnoteHistory = "{}"
        }
        //get local storage object
        var local = JSON.parse(localStorage.BAMSnoteHistory);
        //set key and value for new key on BAMSnoteHistory object
        var note = {
          "title": key,
          "body": value
        }
        //add the new key to BAMSnoteHistory object
        local[key] = note;
        //reset localStorage
        localStorage.BAMSnoteHistory = JSON.stringify(local);
        console.log("local", JSON.parse(localStorage.BAMSnoteHistory));
      },
      getLocalStorage : function(){
        var local = JSON.parse(localStorage.BAMSnoteHistory);
        // console.log("local ", local);
        return local;
      },
      getTitle: function() {
        return titleName;
      },
      setTitle: function(value) {
        titleName = value;
      }
    }
})
.controller('NotesCtrl', ['localStore', '$interval', function($localStore, $interval) {
  var self = this;
  // $localStore.setLocalStorage('matt','iammatt');
  $interval(function(){
    if(localStorage.BAMSnoteHistory !== undefined){
    self.noteHistory = $localStore.getLocalStorage();

    }
  }, 500);
  self.notes;
}])
.controller('SingleNoteCtrl', ['localStore','$stateParams', '$state',
  function($localStore, $stateParams, $state) {
  var self = this;
  self.EditMode = false;
    var local = JSON.parse(localStorage.BAMSnoteHistory);
    self.title = $stateParams.noteTitle;
    self.body = local[self.title].body;
    self.editNote = function(theTitle) {
      // console.log($stateParams.noteTitle);
      // $localStore.setTitle($stateParams.noteTitle);
      // $state.go("app.edit");
      self.EditMode = true;
      self.editNoteTitle =  self.title;
      self.editNoteBody =  self.body;
    }
    console.log($stateParams);
    self.saveNote = function() {
      self.EditMode = false;
      $localStore.setLocalStorage(self.editNoteTitle, self.editNoteBody);
      self.body = self.editNoteBody;
      self.title = self.editNoteTitle;
    }
    self.delete = function(){
    console.log("local[self.title]", local[self.title]);
    delete local[self.title];
    localStorage.BAMSnoteHistory = JSON.stringify(local);
    $state.go('app.notes');
  }
    //FOR EDIT MODE
      //have edit button in top corner
      //when edit button is clicked
        //set a factory variable of the title of the current note in view (maybe in state params)
        //go to #/something/edit
        //load the factory variable as the title
        //grab the body associated with it and throw it in textarea
}])
.controller('AddNoteCtrl', ['localStore','$state',
 function($localStore, $state) {
  var self = this;
  //ng-model for note body
  self.noteTitle;
  self.noteBody;
//   var listener = new webspeech.Listener();
// self.speechRec = function(){
//     listener.listen("en", function(text) {
//            console.log("text ", text);
//            document.getElementById("text").value += text;
//           self.noteBody += text;
//         });
// }
  self.createNote = function(title,body){
    console.log("title", title);
    console.log("body", body);
    //save to local storage
    $localStore.setLocalStorage(title,body)
    $state.go('app.notes')
    self.noteTitle = '';
    self.noteBody = '';
  }
}])
.controller('editNoteCtrl', ['localStore', '$stateParams', '$state',
  function(localStore, $stateParams, $state){
    var self = this;
    console.log('heyo');
    console.log(localStore.getLocalStorage());
    var titlePassed = localStore.getTitle();
    if (titlePassed === undefined) {
     $state.go('app.notes')
    } else {
      self.noteBody = localStore.getLocalStorage()[titlePassed].body;
      self.noteTitle = titlePassed;
      console.log("here inside the else")
    }
    console.log(titlePassed);
    console.log(localStore.getLocalStorage()[titlePassed]);
    self.noteTitle;
    self.noteBody;
  }]);
// editNoteCtrl
