/**
 * @fileoverview SparqlBlocks - maintaining a db of used resources
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');
var SparqlGen = require('../generators/sparql.js');
var Prefixes = require('./prefixes.js');
var flyouts = require('./flyout')
var Msg = require('./msg')

var NAME_TYPE = 'MY_VARIABLES';

var VAR_TYPES_TO_NAME = {
    "SOFTWARE_VAR": "Software",
    "VULN_VAR": "Vulnerability",
}

var varToTypeMap = Object.create(null);

function getVariableType(name) {
    return varToTypeMap[name]
}

function getVariableTypeName(name) {
    return VAR_TYPES_TO_NAME[varToTypeMap[name]] || ""
}

function createTypedVariable(workspace, name, type) {
    varToTypeMap[name] = type
    workspace.createVariable(name);
}

var blockly_deleteVariable = Blockly.Workspace.prototype.deleteVariable
Blockly.Workspace.prototype.deleteVariable = function (name) {
    if (varToTypeMap[name]) {
        delete varToTypeMap[name]
    }
    return blockly_deleteVariable.call(this, name)
}
var blockly_renameVariable = Blockly.Workspace.prototype.renameVariable
Blockly.Workspace.prototype.renameVariable = function(oldName, newName) {
    var type = varToTypeMap[oldName]
    if (type) {
        delete varToTypeMap[oldName]
        varToTypeMap[newName] = type
    }
    return blockly_renameVariable.call(this, oldName, newName)
}

var blockly_clear = Blockly.Workspace.prototype.clear
Blockly.Workspace.prototype.clear = function() {
    varToTypeMap = Object.create(null)
    return blockly_clear.call(this)
}

var blockly_updateVariableList = Blockly.Workspace.prototype.updateVariableList
Blockly.Workspace.prototype.updateVariableList = function(clearList) {
   if (clearList) {
       varToTypeMap = Object.create(null)
   }
   return blockly_updateVariableList.call(this, clearList)
}

function flyoutCategory(workspace) {
    // variableList.sort(goog.string.caseInsensitiveCompare);
    var xmlList = [];

    var buttons = [];

    for (var type in VAR_TYPES_TO_NAME) {
        var name = VAR_TYPES_TO_NAME[type];
        var button = document.createElement('button');
        button.setAttribute('text', Msg.NEW_TYPED_VARIABLE.replace('%1', name));
        buttons.push({ type: type , button: button });
    }

    var variableList = workspace.variableList;
    var variablesByType = Object.create(null);

    variableList.forEach(function (name) {
        var type = getVariableType(name);
        if (type) {
            variablesByType[type] = variablesByType[type] || [];
            variablesByType[type].push(name);
        }
    })

    buttons.forEach(function (entry) {
        var type = entry.type
        var markup = entry.button

        xmlList.push(markup)

        if (variablesByType[type]) {
            variablesByType[type].forEach(function (name) {
                var block = document.createElement('block');
                block.setAttribute('type', 'variables_get');
                if (Blockly.Blocks['variables_set']) {
                    block.setAttribute('gap', 8);
                }
                var field = document.createElement('field')
                field.appendChild(document.createTextNode(name));
                field.setAttribute('name', 'VAR');
                block.appendChild(field);
                xmlList.push(block);
            })
        }
    })

    return xmlList;
}

flyouts.addFlyout(NAME_TYPE, flyoutCategory);

var varTypesCounter = {};
function generateNameAndCreateVariable(workspace, type) {
    varTypesCounter[type] = varTypesCounter[type] || 0;
    varTypesCounter[type]++;

    var name = VAR_TYPES_TO_NAME[type] + ' ' + varTypesCounter[type]
    if (workspace.variableIndexOf(name) !== -1) {
        return generateNameAndCreateVariable(workspace, type)
    }

    createTypedVariable(workspace, name, type)

    return name;
}

Blockly.FlyoutButton.prototype.onMouseUp = function (e) {
    // Don't scroll the page.
    e.preventDefault();
    // Don't propagate mousewheel event (zooming).
    e.stopPropagation();

    // Stop binding to mouseup and mousemove events--flyout mouseup would normally
    // do this, but we're skipping that.
    Blockly.Flyout.terminateDrag_();

    for (var type in VAR_TYPES_TO_NAME) {
        var name = VAR_TYPES_TO_NAME[type]
        if (e.currentTarget.textContent.toLowerCase().indexOf(name.toLowerCase()) !== -1) {
            generateNameAndCreateVariable(this.targetWorkspace_, type)
            return
        }
    }

    Blockly.Variables.createVariable(this.targetWorkspace_);
}

module.exports = {
    getVariableType: getVariableType,
    getVariableTypeName: getVariableTypeName,
    NAME_TYPE: NAME_TYPE,
};
