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
 * @fileoverview Executing SPARQL queries
 * @author miguel.ceriani@gmail.com (Miguel Ceriani)
 */
'use strict';

goog.provide('SparqlBlocks.Exec');

goog.require('SparqlBlocks.Sparql');

SparqlBlocks.Exec = ( function() {

  var sparqlExec_ = function(endpointUrl, query, callback) {
    var queryUrl =
        endpointUrl +
        "?query=" + encodeURIComponent(query);
    return $.ajax({
        headers: {Accept: "application/sparql-results+json"},
        dataType: "json",
        method: "GET",
        url: queryUrl})
      .done(function(data) {
        callback(null,data);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        callback({ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
      });
  }

  var sparqlExecAndAlert_ = function(endpointUrl, query) {
    return sparqlExec_(endpointUrl, query, function(err, data) {
      if (err) {
        alert("Error: " + err);
      } else {
        alert("Results:\n" + JSON.stringify(data));
      }
    })
  }

  var sparqlExecAndBlock_ = function(endpointUrl, query, workspace, callback) {
  }

  var connect_ = function(connection, block) {
    var targetBlock = connection.targetBlock();
    if (targetBlock) {
      targetBlock.dispose();
    }
    connection.connect(block.previousConnection);
    block.render();
  }

  var unconnect_ = function(connection) {
    var targetBlock = connection.targetBlock();
    if (targetBlock) {
      targetBlock.dispose();
    }
  }

  var DESCR_LENGTH = 40;

  // var RESULT_EMPTY_QUERY = "";
  // var RESULT_IN_PROGRESS = "execution in progress...";

  var setResult_ = function(resultsInput, resultField) {
    resultsInput.removeField("RESULTS_CONTAINER");
    resultsInput.appendField(resultField, "RESULTS_CONTAINER");
  };

  var sparqlExecAndPublish_ = function(endpointUrl, query, workspace, resultsInput, callback) {

    setResult_(resultsInput, SparqlBlocks.Msg.EXECUTION_IN_PROGRESS);

    return sparqlExec_(endpointUrl, query, function(err, data) {
      var resultField = null;
      if (err) {
        var errorDescr = err.jqXHR.responseText;
        if (errorDescr) {
          var errorDescrShort = null;
          if (errorDescr.length > DESCR_LENGTH) {
            errorDescrShort = errorDescr.substr(0, DESCR_LENGTH - 3) + '...';
          } else {
            errorDescrShort = errorDescr;
          }
          resultField = new Blockly.FieldTextInput(errorDescrShort);
          // resultField.setEditable(false);
          resultField.setTooltip(errorDescr);
        } else {
          resultField = SparqlBlocks.Msg.EXECUTION_CONNECTION_ERROR;
        }
      } else {
        resultField = new SparqlBlocks.FieldTable(data);
      }
      setResult_(resultsInput, resultField);
      callback(data);
    });
  }

  var blockExecQuery_ = function(block, queryStr, resultsHolder) {
    if (!resultsHolder) {
      resultsHolder = block.getInput('RESULTS');
    }
    if (!resultsHolder) return;
    var endpointUri_txt = block.getFieldValue('ENDPOINT');
    var endpointUri = endpointUri_txt ? encodeURI(endpointUri_txt) : null;
    if (endpointUri != block.endpointUri || queryStr != block.sparqlQueryStr) {
      block.endpointUri = endpointUri;
      block.sparqlQueryStr = queryStr;
      if (block.queryReq) {
        block.queryReq.abort();
      }
      if (queryStr && endpointUri) {
        console.log('Ready to execute query: ' + queryStr);
        block.resultsData = null;
        block.queryReq = SparqlBlocks.Exec.sparqlExecAndPublish(
            endpointUri, queryStr,
            block.workspace,
            resultsHolder,
            function(data) {
              block.queryReq = null;
              block.resultsData = data;
            } );
      } else {
        block.resultsData = null;
        setResult_(resultsHolder, SparqlBlocks.Msg.EXECUTION_PLACEHOLDER);
        block.queryReq = null;
      }

    }

  }

  var blockExec_ = function(block, queryBlock, resultsHolder) {
    if (!queryBlock) {
      queryBlock = block.getInputTargetBlock('QUERY');
    }
    var queryStr = SparqlBlocks.Sparql.sparqlQuery(queryBlock);
    blockExecQuery_(block, queryStr, resultsHolder);
  }

  return {
    sparqlExecAndPublish: sparqlExecAndPublish_,
    sparqlExecAndAlert: sparqlExecAndAlert_,
    sparqlExec: sparqlExec_,
    blockExec: blockExec_,
    blockExecQuery: blockExecQuery_
  };

}) ();
