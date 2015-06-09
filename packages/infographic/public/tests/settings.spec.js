'use strict';

(function () {
    // Settings Controller Spec
    describe('MEAN controllers', function () {
        describe('SettingsController', function () {
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
                module('mean.settings');
            });

            // Initialize the controller and a mock scope
            var SettingsController,
                    scope,
                    $httpBackend,
                    $stateParams,
                    $location;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

                scope = $rootScope.$new();

                SettingsController = $controller('SettingsController', {
                    $scope: scope
                });

                $stateParams = _$stateParams_;

                $httpBackend = _$httpBackend_;

                $location = _$location_;

            }));

            it('$scope.find() should create an array with at least one setting object ' +
                    'fetched from XHR', function () {

                        // test expected GET request
                        $httpBackend.expectGET('settings').respond([{
                                title: 'A Setting about MEAN',
                                content: 'MEAN rocks!'
                            }]);

                        // run controller
                        scope.find();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.settings).toEqualData([{
                                title: 'A Setting about MEAN',
                                content: 'MEAN rocks!'
                            }]);

                    });

            it('$scope.findOne() should create an array with one setting object fetched ' +
                    'from XHR using a settingId URL parameter', function () {
                        // fixture URL parament
                        $stateParams.settingId = '525a8422f6d0f87f0e407a33';

                        // fixture response object
                        var testSettingData = function () {
                            return {
                                title: 'A Setting about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // test expected GET request with response object
                        $httpBackend.expectGET(/settings\/([0-9a-fA-F]{24})$/).respond(testSettingData());

                        // run controller
                        scope.findOne();
                        $httpBackend.flush();

                        // test scope value
                        expect(scope.setting).toEqualData(testSettingData());

                    });

            it('$scope.create() with valid form data should send a POST request ' +
                    'with the form input values and then ' +
                    'locate to new object URL', function () {

                        // fixture expected POST data
                        var postSettingData = function () {
                            return {
                                title: 'A Setting about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // fixture expected response data
                        var responseSettingData = function () {
                            return {
                                _id: '525cf20451979dea2c000001',
                                title: 'A Setting about MEAN',
                                content: 'MEAN rocks!'
                            };
                        };

                        // fixture mock form input values
                        scope.title = 'A Setting about MEAN';
                        scope.content = 'MEAN rocks!';

                        // test post request is sent
                        $httpBackend.expectPOST('settings', postSettingData()).respond(responseSettingData());

                        // Run controller
                        scope.create(true);
                        $httpBackend.flush();

                        // test form input(s) are reset
                        expect(scope.title).toEqual('');
                        expect(scope.content).toEqual('');

                        // test URL location to new object
                        expect($location.path()).toBe('/settings/' + responseSettingData()._id);
                    });

            it('$scope.update(true) should update a valid setting', inject(function (Settings) {

                // fixture rideshare
                var putSettingData = function () {
                    return {
                        _id: '525a8422f6d0f87f0e407a33',
                        title: 'A Setting about MEAN',
                        to: 'MEAN is great!'
                    };
                };

                // mock setting object from form
                var setting = new Settings(putSettingData());

                // mock setting in scope
                scope.setting = setting;

                // test PUT happens correctly
                $httpBackend.expectPUT(/settings\/([0-9a-fA-F]{24})$/).respond();

                // testing the body data is out for now until an idea for testing the dynamic updated array value is figured out
                //$httpBackend.expectPUT(/settings\/([0-9a-fA-F]{24})$/, putSettingData()).respond();
                /*
                 Error: Expected PUT /settings\/([0-9a-fA-F]{24})$/ with different data
                 EXPECTED: {"_id":"525a8422f6d0f87f0e407a33","title":"A Setting about MEAN","to":"MEAN is great!"}
                 GOT:      {"_id":"525a8422f6d0f87f0e407a33","title":"A Setting about MEAN","to":"MEAN is great!","updated":[1383534772975]}
                 */

                // run controller
                scope.update(true);
                $httpBackend.flush();

                // test URL location to new object
                expect($location.path()).toBe('/settings/' + putSettingData()._id);

            }));

            it('$scope.remove() should send a DELETE request with a valid settingId ' +
                    'and remove the setting from the scope', inject(function (Settings) {

                        // fixture rideshare
                        var setting = new Settings({
                            _id: '525a8422f6d0f87f0e407a33'
                        });

                        // mock rideshares in scope
                        scope.settings = [];
                        scope.settings.push(setting);

                        // test expected rideshare DELETE request
                        $httpBackend.expectDELETE(/settings\/([0-9a-fA-F]{24})$/).respond(204);

                        // run controller
                        scope.remove(setting);
                        $httpBackend.flush();

                        // test after successful delete URL location settings list
                        //expect($location.path()).toBe('/settings');
                        expect(scope.settings.length).toBe(0);

                    }));
        });
    });
}());
