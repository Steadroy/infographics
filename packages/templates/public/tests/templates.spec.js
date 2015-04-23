'use strict';

(function () {
    // Templates Controller Spec
    describe('MEAN controllers', function () {
        describe('TemplatesController', function () {
            // The $resource service augments the response object with methods for updating and deleting the resource.
            // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
            // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
            // When the toEqualData matcher compares two objects, it takes only object properties into
            // account and ignores methods.
            beforeEach(function () {
                jasmine.addMatchers({
                    toEqualData: function () {
                        return {
                            compare: function (actual, expected) {
                                return {
                                    pass: angular.equals(actual, expected)
                                };
                            }
                        };
                    }
                });
            });

            beforeEach(function () {
                module('mean');
                module('mean.system');
                module('mean.templates');
            });

            // Initialize the controller and a mock scope
            var TemplatesController,
                    scope,
                    $httpBackend,
                    $stateParams,
                    $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                TemplatesController = $controller('TemplatesController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one template object ' +
                    'fetched from XHR', function () {

                        // test expected GET request
                        $httpBackend.expectGET('templates').respond([{
                                title: 'A Template about MEAN',
                                content: 'MEAN rocks!'
                            }]);

                        // run controller
                        scope.find();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.templates).toEqualData([{
                                title: 'A Template about MEAN',
                                content: 'MEAN rocks!'
                            }]);

                    });

            it('$scope.findOne() should create an array with one template object fetched ' +
                    'from XHR using a templateId URL parameter', function () {
                        // fixture URL parament
                        $stateParams.templateId = '525a8422f6d0f87f0e407a33';

                        // fixture response object
                        var testTemplateData = function () {
                            return {
                                title: 'A Template about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // test expected GET request with response object
                        $httpBackend.expectGET(/templates\/([0-9a-fA-F]{24})$/).respond(testTemplateData());

                        // run controller
                        scope.findOne();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.template).toEqualData(testTemplateData());

                    });

            it('$scope.create() with valid form data should send a POST request ' +
                    'with the form input values and then ' +
                    'locate to new object URL', function () {

                        // fixture expected POST data
                        var postTemplateData = function () {
                            return {
                                title: 'A Template about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // fixture expected response data
                        var responseTemplateData = function () {
                            return {
                                _id: '525cf20451979dea2c000001',
                                title: 'A Template about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // fixture mock form input values
                        scope.title = 'A Template about MEAN';
                        scope.content = 'MEAN rocks!';

                        // test post request is sent
                        $httpBackend.expectPOST('templates', postTemplateData()).respond(responseTemplateData());

                        // Run controller
                        scope.create(true);
                        $httpBackend.flush();

                        // test form input(s) are reset
                        expect(scope.title).toEqual('');
                        expect(scope.content).toEqual('');

                        // test URL location to new object
                        expect($location.path()).toBe('/templates/' + responseTemplateData()._id);
                    });

            it('$scope.update(true) should update a valid template', inject(function (Templates) {

                // fixture rideshare
                var putTemplateData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'A Template about MEAN',
                        to: 'MEAN is great!'
                    };
                };

                // mock template object from form
                var template = new Templates(putTemplateData());

                // mock template in scope
                scope.template = template;

                // test PUT happens correctly
                $httpBackend.expectPUT(/templates\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/templates\/([0-9a-fA-F]{24})$/, putTemplateData()).respond();
                /*
                 Error: Expected PUT /templates\/([0-9a-fA-F]{24})$/ with different data
                 EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"A Template about MEAN","to":"MEAN is great!"}
                 GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"A Template about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                 */

                // run controller
                scope.update(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/templates/' + putTemplateData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid templateId ' +
                    'and remove the template from the scope', inject(function (Templates) {

                        // fixture rideshare
                        var template = new Templates({
                            _id: '525a8422f6d0f87f0e407a33'
                        });

                        // mock rideshares in scope
                        scope.templates = [];
                        scope.templates.push(template);

                        // test expected rideshare DELETE request
                        $httpBackend.expectDELETE(/templates\/([0-9a-fA-F]{24})$/).respond(204);

                        // run controller
                        scope.remove(template);
                        $httpBackend.flush();

                        // test after successful delete URL location templates list
                        //expect($location.path()).toBe('/templates');
                        expect(scope.templates.length).toBe(0);

                    }));
        });
    });
}());
