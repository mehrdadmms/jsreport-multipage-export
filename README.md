# jsreport-multipage-export

You can export multiple HTMLs to a single PDF <br>
This code is based on [jsreport-core](https://github.com/jsreport/jsreport-core) <br>
You can see their documentation to understand how to design your HTML and pass parameters
 

# Port
Server is running on port 8010 you can change it in config

# Quit start
Install packages 
```
npm install
```

Start server
```
node app.js
```

# Quick example

```
    const fs = require('fs');
    const request = require('request');

    const body = [
        {
            "html": "content of ParamPage.html",
            "data": {
                "param":{
                    "followers":"12,342",
                    "taged":"200",
                    "engagementRate":"20.32%",
                    "posts":"2420"
                }
            }
        },
        {
            "html": "content of ParamPage.html",
            "data": {
                "param":{
                    "followers":"12,342",
                    "taged":"200",
                    "engagementRate":"20.32%",
                    "posts":"2420"
                }
            }
        }
    ]
    request.post("http://localhost:8010", {json: body}, (error, response, body) => {
        if (error) throw error;
        if (body.status !== 200) throw body;
        const filePath = './my_awesome_pdf.pdf';
        fs.writeFileSync(filePath, Buffer.from(body.data.pdf.data));
        console.log(filePath);
    });
```
