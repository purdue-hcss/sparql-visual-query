# sparal-visual-query

## Usage

Download `sparqlblocks.min.js`, `sparqlblocks.min.js.map` and `style.css` in `/dist`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Add dependencies --> 
    <script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="/path/to/sparqlblocks.min.js"></script>
    <script src="/path/to/sparqlblocks.min.js.map"></script>
    <link href="/path/to/style.css" rel="stylesheet"></link>
    
    <style>
        #test{
            width: 100vw;
            height: 100vh;
        }
        #run{
            position:absolute;
            top:20px;
            right:40px;
        }
    </style>

</head>
<body>
    <div id="test"></div>
    <button id="run">Run</button>
    <script>
        var test = document.querySelector("#test")
        //  Add block's DOM to the custom DOM
        sparqlVisualQuery.createBlocks(test)
        // Set custom query endpointURL
        sparqlVisualQuery.setURL("http://127.0.0.1:3030/kg")

        const btn = document.querySelector("#run");
        btn.addEventListener("click", function(){
            // Get SPARQL code
            alert(sparqlVisualQuery.getQuery()) 
            // Get query result
            sparqlVisualQuery.getResult().then((val)=>{
                console.log(val);
            });
        })
        
    </script>
</body>
</html>

```