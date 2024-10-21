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
  var htmlString = '<?xml version="1.0" encoding="utf-8"?>' +
    '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">' +
    '  <xsl:import href="toolboxDemo.xslt"/>' +
    '  <xsl:import href="toolboxTest.xslt"/>' +
    '  <xsl:import href="toolboxGuide.xslt"/>' +
    '  <xsl:import href="dialogsForGuide.xslt"/>' +
    '  <xsl:param name="bundledLibs" select="false"/>' +
    '  <xsl:template match="/"> ' +
    '    <html lang="en"> ' +
    '      <head> ' +
    '        <meta charset="utf-8"/> ' +
    '        <title>SparqlBlocks Demo</title> ' +
    '        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"/> ' +
    '        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css" /> ' +
    '        <link rel="stylesheet" type="text/css" href="css/style.css"/> ' +
    '        <xsl:if test="not($bundledLibs)"> ' +
    '          <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script> ' +
    '          <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script> ' +
    '          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js" integrity="sha512-ExaEi+x+Zqq50MIBraxsK23lQQJZd8Q7ZDlwJsxQwsWlO8XvRouQev9ZWaFxCKdTvrgb2fmf2pglwGp61/7qZA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> ' +
    '        </xsl:if> ' +
    '        <style> ' +
    '          /* 在这里插入你的 CSS 样式 */ ' +
    '        </style> ' +
    '      </head> ' +
    '      <body> ' +
    '        <div id="blocklyDiv"></div> ' +
    '        <xsl:call-template name="toolbox-demo"/> ' +
    '        <xsl:call-template name="toolbox-test"/> ' +
    '        <xsl:call-template name="toolbox-guide"/> ' +
    '        <div id="dialogShadow" class="dialogAnimate"></div> ' +
    '        <div id="dialogBorder"></div> ' +
    '        <div id="dialog"></div> ' +
    '        <div id="flash-messages" class="flash-messages"></div> ' +
    '        <xsl:call-template name="dialogs-for-guide"/> ' +
    '        <script src="js/sparqlblocks.min.js"></script> ' +
    '      </body> ' +
    '    </html> ' +
    '  </xsl:template> ' +
    '</xsl:stylesheet>';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/xml");
  dom.appendChild(doc.documentElement);
}

module.exports = {
  Storage: Storage,
  Guide: Guide,
  Track: Track,
  WorkspaceActions: WorkspaceActions,
  BlocklyDialogs: BlocklyDialogs,
  createBlocks:createBlocks,
};

// SparqlBlocks.Storage = Storage;
// SparqlBlocks.Guide = Guide;
// SparqlBlocks.Track = Track;
// SparqlBlocks.WorkspaceActions = WorkspaceActions;
// SparqlBlocks.BlocklyDialogs = BlocklyDialogs;
