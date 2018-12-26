const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");

describe("Application launch", function() {
  this.timeout(10000);

  beforeEach(function() {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, "..")]
    });
    return this.app.start();
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it("shows an initial window and devtools", function() {
    return this.app.client.getWindowCount().then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("window has correct width", function() {
    return this.app.browserWindow.getSize().then(function(sizeArray) {
      assert.equal(sizeArray[0], 700);
    });
  });

  it("window has correct height", function() {
    return this.app.browserWindow.getSize().then(function(sizeArray) {
      assert.equal(sizeArray[1], 890);
    });
  });
});
