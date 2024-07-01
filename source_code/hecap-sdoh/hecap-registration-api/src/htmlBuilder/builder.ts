const fs = require('fs');
const cheerio = require('cheerio');

function buildHtmlConsentForm(context, jsonData, dateSignature) {
    const htmlFilePath = 'static/consent-template.html';
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    const $ = cheerio.load(htmlContent);
    const userNameLabel = $('label:contains("Name:")');
    userNameLabel.text('Name: ' + jsonData.firstname + " " + jsonData.lastname); // Replace 'John Doe' with the desired user name
    const dateLabel = $('label:contains("Date:")');
    dateLabel.text('Date: ' + dateSignature); // Replace 'John Doe' with the desired user name
    $(".signatureimg").attr('src', jsonData.signature)
    // Get the modified HTML content
    const modifiedHtml = $.html();

    return modifiedHtml
}

module.exports = {buildHtmlConsentForm}