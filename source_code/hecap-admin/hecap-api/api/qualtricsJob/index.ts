import { AzureFunction, Context } from "@azure/functions"
import exec = require("./process/Executor")

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('===QualtricsJob Timer function is running late!');
    }
    context.log('===QualtricsJob Timer trigger function started.........', timeStamp);   
    await exec.run(context, timeStamp)
};

export default timerTrigger;
