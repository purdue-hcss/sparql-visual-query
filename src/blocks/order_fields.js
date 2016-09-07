/**
 * @fileoverview Order by & limit blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

var Blockly = require('blockly');
var Types = require('../core/types');
var typeExt = Types.getExtension;

var defaultLimit = 5;
var maxLimit = 50;

var setOrderField = function(queryBlock, index, lastOrderField, limitField) {
  console.log('setOrderField(' + queryBlock + ', ' + index + ', ' + lastOrderField + ', ' + limitField + ')');
  var inputName = limitField ? 'LIMIT' : 'ORDER_FIELD' + index;
  console.log('inputName: ' + inputName);
  var otherFieldNames = limitField ?
          ['LIMIT_LABEL_PRE', 'LIMIT', 'LIMIT_LABEL_POST'] :
          ['ORDER_LABEL' + index];
  console.log('otherFieldNames: ' + otherFieldNames);
  var dirFieldName = index > 1 && 'ORDER_DIRECTION' + (index - 1);
  console.log('dirFieldName: ' + dirFieldName);
  var oldDirValue = dirFieldName && queryBlock.getFieldValue(dirFieldName);
  console.log('oldDirValue: ' + oldDirValue);
  var input = queryBlock.getInput(inputName);
  if (input) {
    // remove all the fields
    while (input.fieldRow.length > 0) {
      input.removeField(input.fieldRow[0].name);
    }
  } else {
    input = limitField ?
              queryBlock.appendDummyInput(inputName) :
              queryBlock.appendValueInput(inputName)
                        .setCheck(typeExt("Expr"));
    if (!limitField && queryBlock.getInput("LIMIT")) {
      queryBlock.moveInputBefore(inputName, "LIMIT");
    }
    // queryBlock.moveInputBefore(inputName, "RESULTS");
  }
  if (dirFieldName) {
    var dirField = new Blockly.FieldDropdown([["◣", "ASC"], ["◤", "DESC"]]);
    if (oldDirValue) {
      dirField.setValue(oldDirValue);
    }
    input.appendField(dirField, dirFieldName);
  }
  if (limitField) {
    input.appendField("  limit to first", otherFieldNames[0])
        .appendField(new Blockly.FieldNumber(defaultLimit, 0, maxLimit), otherFieldNames[1])
        .appendField("rows", otherFieldNames[2]);
  } else {
    input.appendField(
        index > 1 ?
            (!lastOrderField || index > 2 ? ", " : "") +
                (lastOrderField ? "and " : "") + "then by" :
            "order by",
        otherFieldNames[0]);
  }
  if (lastOrderField) {
    setOrderField(queryBlock, index + 1, false, true);
  }
};

module.exports = {
  init: function() {
      this.orderFieldCount_ = 1;
      setOrderField(this, this.orderFieldCount_, true);
  },
  onchange: function() {
    // Dynamically add or remove order fields as needed
    var lastOrderInput = this.getInput('ORDER_FIELD' + this.orderFieldCount_);
    var lastOrderConnection = lastOrderInput && lastOrderInput.connection.targetConnection;
    if (lastOrderConnection) { // last order item is connected
      if (this.orderFieldCount_ > 1) {
        setOrderField(this, this.orderFieldCount_, false);
      }
      this.orderFieldCount_++;
      setOrderField(this, this.orderFieldCount_, true);
    } else if (this.orderFieldCount_ > 1) {
      while ( this.orderFieldCount_ > 1 &&
              !(this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1))
                    .connection.targetConnection)) {
        this.removeInput('ORDER_FIELD' + this.orderFieldCount_);
        this.orderFieldCount_--;
      }
      setOrderField(this, this.orderFieldCount_, true);
    }
  },
  /**
   * Create XML to represent the number of order fields.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('order_field_count', this.orderFieldCount_);
    return container;
  },
  /**
   * Parse XML to restore the order fields.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.orderFieldCount_ = parseInt(xmlElement.getAttribute('order_field_count'), 10);
    for (var i = 2; i <= this.orderFieldCount_; i++) {
      var inputName = 'ORDER_FIELD' + i;
      var labelFieldName = 'ORDER_LABEL' + i;
      var dirFieldName = 'ORDER_DIRECTION' + (i - 1);
      var dirField = new Blockly.FieldDropdown([["◣", "ASC"], ["◤", "DESC"]]);
      this.appendValueInput(inputName)
          .setCheck(typeExt("Expr"))
          .appendField(
            (i !== this.orderFieldCount_ || i > 2 ? ", " : "") + "and then by",
            labelFieldName)
          .appendField(dirField, dirFieldName);
      this.moveInputBefore(inputName, "AFTER_ORDER");
    }
  }
};
