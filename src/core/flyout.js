var Blockly = require('blockly');

var flyouts = Object.create(null)

var blocklyFlyoutShow = Blockly.Flyout.prototype.show;

Blockly.Flyout.prototype.show = function(xmlList) {
    for (var key in flyouts)  {
        if (xmlList === key) {
            // Special category for resources.
            xmlList = flyouts[key](this.workspace_.targetWorkspace);
        }
    }
    blocklyFlyoutShow.call(this, xmlList);
}

module.exports = {
    addFlyout: function (type, callback){
        flyouts[type] = callback
    }
}
