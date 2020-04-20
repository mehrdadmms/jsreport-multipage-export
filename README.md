# jsreport-multipage-export

You can export dashboard by sending multiple htmls 

# Port
Server is running on port 8010 you can change it in config

# Export path
PDFs will be exported into /PDFs/ directory in parent directory of project 
it should be mounted to neolyze download PDFs directory 
/home/neolyze/api.neolyze.com/downloads/PDFs

# Quick example

<p>
    POST https://localhost:8010
    [
        {
            html: <html file content>,
            data: <paramters related to this html>
        },
        {
            html: <html file content>,
            data: <paramters related to this html>
        }
    ]
</p>