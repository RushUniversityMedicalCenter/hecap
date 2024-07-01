const blobClient = require("./blobClient")
const fileSystemhecapHtmlRpt = process.env._STORAGE_CONTAINER_HTML_RPT || "";
const fileSystemhecapPdfRpt = process.env._STORAGE_CONTAINER_PDF_RPT || "";
const hecapBlobHtmlContainer = blobClient.getFileSystemClient(fileSystemhecapHtmlRpt)
const hecapBlobPdfRptContainer = blobClient.getFileSystemClient(fileSystemhecapPdfRpt)

async function upload(context, bufferContent, blobName) {
    try {
        context.log("====upload:blobName:", blobName)
        const fileClient = hecapBlobHtmlContainer.getFileClient(blobName)
        await fileClient.create()
        await fileClient.append(bufferContent, 0, bufferContent.length)
        const flushFileResponse = await fileClient.flush(bufferContent.length)
        context.log(`===storeBlob: Upload file ${blobName} successfully`, flushFileResponse.requestId)
        return flushFileResponse.requestId
    } catch (err) {
      context.log("===datalake.storeBufferToBlob exception: " + blobName, err );
      return err 
      }
  }

  module.exports = {upload}