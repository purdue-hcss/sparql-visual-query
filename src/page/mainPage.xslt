<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml">
  <xsl:import href="toolboxDemo.xslt"/>
  <xsl:import href="toolboxTest.xslt"/>
  <xsl:import href="toolboxGuide.xslt"/>
  <xsl:import href="dialogsForGuide.xslt"/>

  <xsl:param name="bundledLibs" select="false"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>SparqlBlocks Demo</title>

        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"/>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
        <script type="text/javascript" src="/path/to/highlight.pack.js"></script>
<script type="text/javascript" src="/path/to/highlightjs-sparql/src/languages/sparql.js"></script>
        <xsl:if test="not($bundledLibs)">
          <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
        </xsl:if>
        <style>
        .blocklyToolboxDiv{
          background-color: white !important;
          border: #ccc solid 1px;
          border-radius: 0 0 8px 0;
          overflow: hidden !important;
        }
        .play-button{
          border: 1px solid #dadce0;
          border-radius: 4px;
          box-sizing: border-box;
          color: #1a73e8;
          cursor: pointer;
          display: inline-block;
          font: 500 14px / 36px var(--font-family);
          padding: 0 16px;
          position: absolute;
          right: 20px;
          top: 5px;
        }
        #blocklyDiv{
          float: left !important;
          height: 100% !important;
          width: 60% !important;
        }
        .blocklyFlyoutBackground {
            fill: #39272e38 !important;
        }
        .operate{
          height:60%;
          width:100%;
          display:flex;
        }
        .main{
          height:100%;
          width:100%;
        }
        #code{
          height:100%;
          width:40%;
        }
        #result{
          width:100%;
          height:40%;
        }
        #table{
          width:100%;
          height:100%;
        }
        .title{
          width:100%;
          height:35px;
          background-color:#93AFC4;
          font-size: 18px;
          font-weight: 600;
          display:flex;
          align-items:center;
          color:white;
        }
        </style>

      </head>
      <body>
      <div class="main">
        <div class="operate">
          <div id="blocklyDiv"></div>
          <div type="text" id='code' style="
              overflow:scroll;
              background-color:white;
              
          "> </div>
        </div>
        <div id="result">
          <div class="title">Query Result</div>
          <div id="table" style="
              background-color: white;
              overflow-x:scroll;
              display: block;
          ">
        
        </div>
        </div>
      </div>
        <div id="execute" class="play-button"  style="display: block;">
          Run
        </div>
        
        <xsl:call-template name="toolbox-demo"/>
        <xsl:call-template name="toolbox-test"/>
        <xsl:call-template name="toolbox-guide"/>

        <div id="dialogShadow" class="dialogAnimate"></div>
        <div id="dialogBorder"></div>
        <div id="dialog"></div>

        <div id="flash-messages" class="flash-messages"></div>

        <xsl:call-template name="dialogs-for-guide"/>
        
        <script src="js/sparqlblocks.min.js"></script>
      </body>
    </html>
  </xsl:template>

  <xsl:output method="html" encoding="utf-8" indent="yes"/>

</xsl:stylesheet>
