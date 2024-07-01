let globalCount = 0;
const globalFunction = () => {
    // Add your code for the global function here
    console.log("Executing globalFunction");
};

function isBlank(variable) {
    return (
        !variable ||
        variable === null ||
        variable === undefined ||
        (typeof variable === 'string' && variable.trim() === '') ||
        (typeof variable === 'string' && variable === 'undefined') ||
        (typeof variable === 'string' && variable === 'null')
      );
}

function httpResponse(context, results) {
    if(results && results.length > 0) {
        context.res = {
            status: 200, 
            body: {"state":"success","numberOfRecords": results.length,"results":results}
        };
    } else {
        context.res = {
            status: 200, 
            body: {"state":"failed","numberOfRecords": 0,"results": []}
        };
    }
}

function funcResponse(context, results, statusCode) {
    if(results && results.length > 0) {
        context.res = {
            status: statusCode, 
            body: {"state":"success","numberOfRecords": results.length,"results":results}
        };
    } else {
        context.res = {
            status: statusCode,
            body: {"state":"no results","numberOfRecords": 0,"results": []}
        };
    }
}
function funcResponseV4(context, results, statusCode) {
    if(results && results.length > 0) {
        return {
            status: statusCode, 
            body: {"state":"success","numberOfRecords": results.length,"results":results}
        };
    } else {
        return {
            status: statusCode,
            body: {"state":"no results","numberOfRecords": 0,"results": []}
        };
    }
}

module.exports = {isBlank, httpResponse, funcResponse, globalCount, globalFunction}