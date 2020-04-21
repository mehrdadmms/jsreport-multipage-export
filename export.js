const express = require('express');
const router = express();
const hummus = require('hummus');
const memoryStreams = require('memory-streams');
const { parallel } = require('async');
const { render } = require('./jsreport');

router.post('/', (req, res) => {
    const data = req.body;
    console.log(`${new Date().toISOString()} | starting new export`);
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
                console.log(`${new Date().toISOString()} | all PDFs exported by jsreport and ready to merge`);
                const mergedPDF = combinePDFBuffers(bufferArray);
                console.log(`${new Date().toISOString()} | PDFs merged successfully`);
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