import axios from "axios";
import libReport from "istanbul-lib-report";
import reports from "istanbul-reports";
import libCoverage from "istanbul-lib-coverage";
import dotenv from 'dotenv'
dotenv.config()

// console.log(process.env.DATABASE_URL)

const url = process.env.URL
const projectID = process.env.PROJECT_ID
const sha = process.env.SHA
const projectCwd = process.env.PROJECT_CMD

function zhuanhuan(cov,projectCwd){
    let result = {}
    for(let key in cov){
        let path = projectCwd+'/' + key
        result[path] = {
            ...cov[key],
            path: path
        }
    }
    return result

}

axios.get(url,{
    params:{
        projectID: projectID,
        sha: sha,
    }
}).then(res=>{







// coverageMap, for instance, obtained from istanbul-lib-coverage
    const coverageMap = libCoverage.createCoverageMap(zhuanhuan(res.data,projectCwd));

    const configWatermarks = {
        statements: [50, 80],
        functions: [50, 80],
        branches: [50, 80],
        lines: [50, 80]
    };

// create a context for report generation
    const context = libReport.createContext({
        dir: 'report',
        // The summarizer to default to (may be overridden by some reports)
        // values can be nested/flat/pkg. Defaults to 'pkg'
        defaultSummarizer: 'nested',
        watermarks: configWatermarks,
        coverageMap,
    })

// create an instance of the relevant report class, passing the
// report name e.g. json/html/html-spa/text
    const report = reports.create('html', {
        // skipEmpty: {},
        // skipFull: configSkipFull
    })

// call execute to synchronously create and write the report to disk
    report.execute(context)


})