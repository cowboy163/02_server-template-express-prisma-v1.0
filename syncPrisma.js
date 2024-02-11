require('dotenv-flow').config();

const {exec} = require('child_process')
const {isProduction, CLog} = require('./src/helper/AppHelper')

if(isProduction()) {
    exec('prisma migrate deploy', (error, stdout, stderr) => {
        if (error) {            
            CLog.bad(`exec error: ${error}`);
            return;
        }
        CLog.ok(`stdout: ${stdout}`);
        CLog.ok(`stderr: ${stderr}`);
    });
} else {
    exec('prisma migrate dev --name init', (error, stdout, stderr) => {
        if (error) {
            CLog.bad(`exec error: ${error}`);
            return;
        }
        CLog.ok(`stdout: ${stdout}`);
        CLog.ok(`stderr: ${stderr}`);
    });
}


