'use strict';

var Blockly = require('blockly'),
  Msg = require('./msg.js'),
    MyVar = require('./myvariables')

var inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};

var caseInsensitiveCompare = function(a, b) {
  a = a || '';
  b = b || '';
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function=} opt_validator A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */
Blockly.CustomFieldVariable = function(varname, opt_validator) {
  Blockly.FieldVariable.superClass_.constructor.call(this,
      Blockly.CustomFieldVariable.dropdownCreate, opt_validator);
  this.setValue(varname || '');
};
inherits(Blockly.CustomFieldVariable, Blockly.FieldVariable);

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldVariable}
 */
Blockly.CustomFieldVariable.dropdownCreate = function() {
  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
    // Get a copy of the list, so that adding rename and new variable options
    // doesn't modify the workspace's list.
    var variableList = this.sourceBlock_.workspace.variableList.slice(0);
  } else {
    var variableList = [];
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && variableList.indexOf(name) == -1) {
    variableList.push(name);
  }
  variableList.sort(caseInsensitiveCompare);
  var entityName = MyVar.getVariableTypeName(name)
  variableList.push(Msg.RENAME_VARIABLE_TYPED.replace('%1', entityName));
  variableList.push(Msg.DELETE_VARIABLE_TYPED.replace('%1', name).replace('%2', entityName));
  // Variables are not language-specific, use the name as both the user-facing
  // text and the internal representation.
  var options = [];
  for (var i = 0; i < variableList.length; i++) {
    options[i] = [variableList[i], variableList[i]];
  }
  return options;
};

/**
 * Event handler for a change in variable name.
 * Special case the 'Rename variable...' and 'Delete variable...' options.
 * In the rename case, prompt the user for a new name.
 * @param {string} text The selected dropdown menu option.
 * @return {null|undefined|string} An acceptable new variable name, or null if
 *     change is to be either aborted (cancel button) or has been already
 *     handled (rename), or undefined if an existing variable was chosen.
 */
Blockly.CustomFieldVariable.prototype.classValidator = function(text) {
  var workspace = this.sourceBlock_.workspace;
  var name = this.getText();
  var entityName = MyVar.getVariableTypeName(name)

  if (text === Msg.RENAME_VARIABLE_TYPED.replace('%1', entityName)) {
    var oldVar = this.getText();
    Blockly.hideChaff();
    while (true) {
      text = Blockly.Variables.promptName(
          Msg.RENAME_VARIABLE_TYPED_TITLE.replace('%1', oldVar).replace('%2', entityName), oldVar);

      if (text) {
        if (workspace.variableIndexOf(text) !== -1) {
          window.alert(Msg.TYPED_VARIABLE_ALREADY_EXISTS.replace('%1', entityName).replace('%2',
              text.toLowerCase()));
        } else {
          workspace.renameVariable(oldVar, text);
          break;
        }
      } else {
        break;
      }
    }
    return null;
  } else if (text === Msg.DELETE_VARIABLE_TYPED.replace('%1', this.getText()).replace('%2', entityName)) {
    workspace.deleteVariable(this.getText());
    return null;
  }
  return undefined;
};
