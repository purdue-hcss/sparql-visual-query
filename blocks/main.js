/**
 * @license
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Main blocks for SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Blocks.main');

// goog.require('Blockly.Blocks');
goog.require('SparqlBlocks.Blocks');

( function() {

  var typeExt = SparqlBlocks.Types.getExtension;

  //Blockly.Blocks.bgp.HUE = 120;
  // Blockly.Blocks.Sparql.varType = "Var";
  // Blockly.Blocks.Sparql.exprTypes = ["Var", "GraphTerm", "Number", "String"];

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#s6azf3
  SparqlBlocks.Blocks.block('sparql_construct', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#construct');
      this.setColour(290);
      this.appendDummyInput()
          .appendField("CONSTRUCT");
      this.appendStatementInput("CONSTRUCT")
          .setCheck("ConstructTriples");
      this.appendDummyInput()
          .appendField("WHERE");
      this.appendStatementInput("WHERE")
          .setCheck("TriplesBlock");
      this.setTooltip('');
    }
  });

  SparqlBlocks.Blocks.block('sparql_select', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#select');
      this.setColour(290);
      // this.appendValueInput("VAR")
      //     .setCheck(["var", "graph_term"]);

      // this.appendStatementInput("SELECT")
      //     .setCheck("VarBindings")
      //     .appendField("SELECT");
      this.appendDummyInput()
          .appendField("select all the variables");

      this.appendStatementInput("WHERE")
          .setCheck("TriplesBlock")
          .appendField("where");

      this.orderFieldCount_ = 1;

      this.appendValueInput("ORDER_FIELD1")
          .setCheck(typeExt("Expr"))
          .appendField("order by", "ORDER_LABEL1")
          .appendField(
            new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
            "ORDER_DIRECTION1");

      this.appendDummyInput("AFTER_ORDER")
          .appendField("& limit to first")
          .appendField(new Blockly.FieldTextInput("5"), "LIMIT")
          .appendField("rows");

      // this.setOutput(true, "Select");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "Select");
      this.setTooltip(SparqlBlocks.Msg.SELECT_TOOLTIP);
    },
    saveQueryAsSparql: function() {
      var sparqlFragment = SparqlBlocks.Sparql.blockToCode(this);
      if (sparqlFragment) {
        var outputBlob = new Blob([sparqlFragment], {type : 'application/sparql-query'});
        saveAs(outputBlob, "query.rq" );
      }
    },
    customContextMenu: function(options) {
      var thisBlock = this;
      SparqlBlocks.Blocks.insertOptionBeforeHelp(options, {
        text: "Save Query as SPARQL",
        enabled: true,
        callback: function() {
          thisBlock.saveQueryAsSparql();
        }
      });
    },
    onchange: function() {
      var lastOrderInput = this.getInput('ORDER_FIELD' + this.orderFieldCount_);
      var lastOrderConnection = lastOrderInput && lastOrderInput.connection.targetConnection;
      if (lastOrderConnection) { // last order item is connected
        if (this.orderFieldCount_ > 1) {
          var inputName = 'ORDER_FIELD' + this.orderFieldCount_;
          var labelFieldName = 'ORDER_LABEL' + this.orderFieldCount_;
          var dirFieldName = 'ORDER_DIRECTION' + this.orderFieldCount_;
          var input = this.getInput(inputName);
          var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
          dirField.setValue(this.getFieldValue(dirFieldName));
          input.removeField(dirFieldName);
          input.removeField(labelFieldName);
          input.appendField(", then by", labelFieldName);
          input.appendField(dirField, dirFieldName);
        }
        this.orderFieldCount_++;
        var inputName = 'ORDER_FIELD' + this.orderFieldCount_;
        this.appendValueInput(inputName)
            .setCheck(typeExt("Expr"))
            .appendField((this.orderFieldCount_ > 2 ? ", " : "") + "and then by",
                         "ORDER_LABEL" + this.orderFieldCount_)
            .appendField(
              new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]),
              'ORDER_DIRECTION' + this.orderFieldCount_);
        this.moveInputBefore(inputName, "AFTER_ORDER");
      } else if (this.orderFieldCount_ > 1) {
        var lastButOneOrderInput =
            this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1));
        if (lastButOneOrderInput &&
            !lastButOneOrderInput.connection.targetConnection) {
          this.removeInput('ORDER_FIELD' + this.orderFieldCount_);
          this.orderFieldCount_--;
          while ( this.orderFieldCount_ > 1
                  && !(this.getInput('ORDER_FIELD' + (this.orderFieldCount_ - 1))
                           .connection.targetConnection)) {
            this.removeInput('ORDER_FIELD' + (this.orderFieldCount_ - 1));
            this.orderFieldCount_--;
          }
          lastButOneOrderInput.name = 'ORDER_FIELD' + this.orderFieldCount_;
          var labelFieldName = 'ORDER_LABEL' + this.orderFieldCount_;
          var dirFieldName = 'ORDER_DIRECTION' + this.orderFieldCount_;
          var prevLabelFieldName = lastButOneOrderInput.fieldRow[0].name;
          var prevDirFieldName = lastButOneOrderInput.fieldRow[1].name;
          var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
          dirField.setValue(this.getFieldValue(prevDirFieldName));
          lastButOneOrderInput.removeField(prevDirFieldName);
          lastButOneOrderInput.removeField(prevLabelFieldName);
          lastButOneOrderInput.appendField(
                this.orderFieldCount_ > 1 ?
                  (this.orderFieldCount_ > 2 ? ", " : "") + "and then by" :
                  "order by",
                labelFieldName);
          lastButOneOrderInput.appendField(dirField, dirFieldName);
        }
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
        var dirFieldName = 'ORDER_DIRECTION' + i;
        var dirField = new Blockly.FieldDropdown([["↓", "ASC"], ["↑", "DESC"]]);
        this.appendValueInput(inputName)
            .setCheck(typeExt("Expr"))
            .appendField(
              (i > 2 ? ", " : "") + "and then by",
              labelFieldName)
            .appendField(dirField, dirFieldName);
        this.moveInputBefore(inputName, "AFTER_ORDER");
      }
    }
  });

  // // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#k5jv58
  // SparqlBlocks.Blocks.block('sparql_variable', {
  //   init: function() {
  //     this.setHelpUrl('http://www.example.com/');
  //     this.setColour(65);
  //     this.appendDummyInput()
  //         .appendField(new Blockly.FieldVariable("var"), "VARNAME");
  //     this.setOutput(true, "var");
  //     this.setTooltip('');
  //   }
  // });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#8nt67n
  SparqlBlocks.Blocks.block('sparql_var_binding', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#selectExpressions');
      this.setColour(330);
      this.appendValueInput("EXPR")
          .setCheck(typeExt("Expr"));
      this.appendDummyInput()
          .appendField("as")
          .appendField(new Blockly.FieldTextInput("col name"), "COLNAME");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "VarBindings");
      this.setNextStatement(true, "VarBindings");
      this.setTooltip('');
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6ttvtd
  SparqlBlocks.Blocks.block('sparql_prefixed_iri', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#prefNames');
      this.setColour(20);
      this.appendDummyInput()
          .appendField(new Blockly.FieldTextInput("prefix"), "PREFIX")
          .appendField(":")
          .appendField(new Blockly.FieldTextInput("localName"), "LOCAL_NAME");
      this.setInputsInline(true);
      this.setOutput(true, "Iri");
      this.setTooltip(SparqlBlocks.Msg.PREFIXED_IRI_TOOLTIP);
    }
  });

  // https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#6ttvtd
  SparqlBlocks.Blocks.block('sparql_iri', {
    init: function() {
      this.setHelpUrl('http://www.w3.org/TR/sparql11-query/#QSynIRI');
      this.setColour(20);
      this.appendDummyInput()
          .appendField("<")
          .appendField(new Blockly.FieldTextInput("iri"), "IRI")
          .appendField(">");
      this.setInputsInline(true);
      this.setOutput(true, "Iri");
      this.setTooltip(SparqlBlocks.Msg.IRI_TOOLTIP);
    }
  });

}) ();
