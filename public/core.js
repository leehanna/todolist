var todolist = angular.module('todolist', []);

function mainController($scope, $http) {
    // formData temporarily holds what is currently inputted into the text field for creation
    $scope.formData = {};

    $http.get('/todos')
        .success(function(data) {
            $scope.todos = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.createTodo = function() {
        $http.post('/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear out formData (text field)
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.markAsDone = function(todo) {
    	$http.put('/todos/' + todo._id, todo)
    		.success(function(data) {
    			$scope.todos = data;
    			console.log(data);
    		})
    		.error(function(data) {
    			console.log('Error: ' + data);
    		});
    };

    $scope.deleteTodo = function(id) {
        $http.delete('/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}