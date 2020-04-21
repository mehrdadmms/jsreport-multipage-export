const express = require('express');
const router = express();
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const { parallel } = require('async');
const { render } = require('./jsreport');

router.post('/', (req, res) => {
    const data = req.body;
    parallel(
        data.map(({html, data}) => {return callback => render(html, data, callback)}),
        (err, bufferArray) => {
            if (err){
                console.error(err);
                return res.json({
                    status: 500,
                    error: err,
                    msg: "could not convert all HTMLs to PDF"
                });
            }
            try{
                const mergedPDF = combinePDFBuffers(bufferArray);
                return res.json({
                    status: 200,
                    msg: "pdf successfully created",
                    data: {
                        pdf: mergedPDF
                    }
                });
            } catch (e) {
                console.log(e);
                return res.json({
                    status: 500,
                    error: e,
                    msg: "could not merge PDFs"
                });
            }
        }
    );
});

function combinePDFBuffers (bufferArray) {
    let outStream = new memoryStreams.WritableStream();
    try {
        let pdfStreamArray = bufferArray.map(buffer => new hummus.PDFRStreamForBuffer(buffer));
        let pdfWriter = hummus.createWriterToModify(
            pdfStreamArray.shift(),
            new hummus.PDFStreamForResponse(outStream)
        );
        pdfStreamArray.map(pdfStream => pdfWriter.appendPDFPagesFromPDF(pdfStream));
        pdfWriter.end();
        let newBuffer = outStream.toBuffer();
        outStream.end();
        return newBuffer;
    }
    catch(e){
        outStream.end();
        throw e;
    }
}

module.exports = router;