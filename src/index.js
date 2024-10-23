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
 * @fileoverview Core JavaScript library for SparqlBlocks.
 * @author fraser@google.com (Neil Fraser), miguel.ceriani@gmail.com (Miguel Ceriani)
 */
// 'use strict';

require('./shims/');

var Storage = require('./core/storage.js');
var Guide = require('./core/guide.js');
var Track = require('./core/track.js');
var BlocklyDialogs = require('./core/lib-dialogs');
var WorkspaceActions = require('./core/workspaceActions.js');

// require('./generators/sparql/');

require('./blocks/logic.js');
require('./generators/sparql/logic.js');
require('./blocks/math.js');
require('./generators/sparql/math.js');
require('./blocks/text.js');
require('./generators/sparql/text.js');
require('./blocks/resources.js');
require('./generators/sparql/resources.js');
require('./blocks/variables.js');
require('./generators/sparql/variables.js');

require('./blocks/bgp.js');
require('./generators/sparql/bgp.js');
require('./blocks/control.js');
require('./generators/sparql/control.js');

require('./blocks/query.js');
require('./generators/sparql/query.js');
require('./blocks/exec.js');
require('./blocks/table.js');
require('./blocks/test.js');

var createBlocks = function(dom){
  dom.innerHTML =  '<div id="blocklyDiv"></div>' +
  '<xml id="toolboxDemo" style="display: none">' +
'<category name=" Query" colour="#DCBDD8">' +
'<block type="sparql_no_execution_endpoint_query_fake">' +
'<field name="LIMIT">5</field>' +
'<value name="WHERE">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'<block type="sparql_no_execution_endpoint_query_fake">' +
'<field name="LIMIT">5</field>' +
'<value name="WHERE">' +
'<block type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">lib</field>' +
'</block>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<block type="sparql_is_called_object">' +
'<value name="OBJECT">' +
'<block type="sparql_text">' +
'<field name="TEXT">ffmpeg</field>' +
'</block>' +
'</value>' +
'</block>' +
'</statement>' +
'</block>' +
'</value>' +
'<value name="WHERE">' +
'<block type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">lib</field>' +
'</block>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<block type="sparql_has_a_version_called_object">' +
'<value name="OBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">version</field>' +
'</block>' +
'</value>' +
'</block>' +
'</statement>' +
'</block>' +
'</value>' +
'<value name="WHERE">' +
'<block type="sparql_typedsubject_propertylist">' +
'<value name="SUBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">version</field>' +
'</block>' +
'</value>' +
'<value name="TYPE">' +
'<block type="sparql_type_version"></block>' +
'</value>' +
'</block>' +
'</value>' +
'<value name="WHERE">' +
'<block type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">cve</field>' +
'</block>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<block type="sparql_affects_object">' +
'<value name="OBJECT">' +
'<block type="variables_get">' +
'<field name="VAR">version</field>' +
'</block>' +
'</value>' +
'</block>' +
'</statement>' +
'</block>' +
'</value>' +
'</block>' +
'</category>' +
'<category name=" Prefix" colour="#B2CEB0">' +
'<block type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</block>' +
'<block type="sparql_typedsubject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">variable</field>' +
'</shadow>' +
'</value>' +
'<value name="TYPE">' +
'<shadow type="sparql_type_version"></shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_verb_object">' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">version</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<block type="sparql_affects_object">' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">version</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_is_called_object">' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">text</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'</category>' +
'<category name=" Compose" colour="#CDC1E4">' +
'<block type="sparql_union">' +
'<value name="OP1">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'<value name="OP2">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'<block type="sparql_optional">' +
'<value name="OP">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'<block type="sparql_graph">' +
'<value name="GRAPHNAME">' +
'<shadow type="variables_get">' +
'<field name="VAR">graph</field>' +
'</shadow>' +
'</value>' +
'<value name="OP">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'</category>' +
'<sep></sep>' +
'<category name=" Logic" colour="#A5CDD4">' +
'<block type="sparql_filter">' +
'<value name="CONDITION">' +
'<shadow type="sparql_logic_boolean"></shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_logic_boolean"></block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_logic_compare">' +
'<value name="A">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">0</field>' +
'</shadow>' +
'</value>' +
'<value name="B">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">0</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_logic_operation">' +
'<value name="A">' +
'<shadow type="sparql_logic_boolean"></shadow>' +
'</value>' +
'<value name="B">' +
'<shadow type="sparql_logic_boolean"></shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_logic_negate"></block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_logic_ternary">' +
'<value name="IF">' +
'<shadow type="sparql_logic_boolean"></shadow>' +
'</value>' +
'<value name="THEN">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'<value name="ELSE">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">0</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_exists">' +
'<value name="OP">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_not_exists">' +
'<value name="OP">' +
'<shadow type="sparql_subject_propertylist">' +
'<value name="SUBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">subj</field>' +
'</shadow>' +
'</value>' +
'<statement name="PROPERTY_LIST">' +
'<shadow type="sparql_verb_object">' +
'<value name="VERB">' +
'<shadow type="variables_get">' +
'<field name="VAR">pred</field>' +
'</shadow>' +
'</value>' +
'<value name="OBJECT">' +
'<shadow type="variables_get">' +
'<field name="VAR">obj</field>' +
'</shadow>' +
'</value>' +
'</shadow>' +
'</statement>' +
'</shadow>' +
'</value>' +
'</block>' +
'</category>' +
'<category name=" Math" colour="#BDC6E5">' +
'<block type="sparql_math_number"></block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_math_arithmetic">' +
'<value name="A">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'<value name="B">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_single">' +
'<value name="NUM">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">-3</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_number_property">' +
'<value name="NUMBER_TO_CHECK">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">0</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_round">' +
'<value name="NUM">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">3.1</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_modulo">' +
'<value name="DIVIDEND">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">64</field>' +
'</shadow>' +
'</value>' +
'<value name="DIVISOR">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">10</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_constrain">' +
'<value name="VALUE">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">50</field>' +
'</shadow>' +
'</value>' +
'<value name="LOW">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'<value name="HIGH">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">100</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_math_random_int">' +
'<value name="FROM">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'<value name="TO">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">100</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_math_random_float"></block>' +
'</category>' +
'<category name=" Text" colour="#A9CFC4">' +
'<block type="sparql_text"></block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_with_lang">' +
'<field name="LANG">en</field>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_text_join"></block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_length">' +
'<value name="VALUE">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abc</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_isEmpty">' +
'<value name="VALUE">' +
'<shadow type="sparql_text">' +
'<field name="TEXT"></field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_charAt">' +
'<value name="VALUE">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abc</field>' +
'</shadow>' +
'</value>' +
'<value name="AT">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">1</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_getSubstring">' +
'<value name="STRING">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abc</field>' +
'</shadow>' +
'</value>' +
'<value name="AT1">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">2</field>' +
'</shadow>' +
'</value>' +
'<value name="AT2">' +
'<shadow type="sparql_math_number">' +
'<field name="NUM">3</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_changeCase">' +
'<value name="TEXT">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abc</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="8"></sep>' +
'<block type="sparql_text_contains">' +
'<value name="FIND">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">bc</field>' +
'</shadow>' +
'</value>' +
'<value name="VALUE">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abcd</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_text_lang">' +
'<value name="LANG">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">en</field>' +
'</shadow>' +
'</value>' +
'<value name="VALUE">' +
'<shadow type="sparql_text_with_lang">' +
'<field name="TEXT">play</field>' +
'<field name="LANG">en</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'<sep gap="32"></sep>' +
'<block type="sparql_hash">' +
'<value name="TEXT">' +
'<shadow type="sparql_text">' +
'<field name="TEXT">abc</field>' +
'</shadow>' +
'</value>' +
'</block>' +
'</category>' +
'<category name=" Entities" colour="#B0CBE1">' +
'<block type="sparql_type_version"></block>' +
'<block type="variables_get">' +
'<field name="VAR">var</field>' +
'</block>' +
'</category>' +
'<sep></sep>' +
'</xml>';

}

var Exec = require("./core/exec.js");
console.log(Exec)

module.exports = {
  Storage: Storage,
  Guide: Guide,
  Track: Track,
  WorkspaceActions: WorkspaceActions,
  BlocklyDialogs: BlocklyDialogs,
  createBlocks: createBlocks,
  getQuery: Exec.getQuery,
};

// SparqlBlocks.Storage = Storage;
// SparqlBlocks.Guide = Guide;
// SparqlBlocks.Track = Track;
// SparqlBlocks.WorkspaceActions = WorkspaceActions;
// SparqlBlocks.BlocklyDialogs = BlocklyDialogs;
