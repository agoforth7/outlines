// Use the expect version of chai assertions - http://chaijs.com/api/bdd
window.expect = chai.expect;

mocha.setup('bdd'); // adds methods to the global scope we can use to test

require('./Auth/UserModel.test');
require('./Pages/PageModel.test');
require('./Pages/PageCollection.test');
require('./Lineart/LineartCollection.test');

window.mocha.run();