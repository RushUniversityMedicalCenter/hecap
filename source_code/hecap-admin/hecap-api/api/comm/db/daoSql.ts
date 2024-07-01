const {isBlank} = require('../commHecap')
const sql = require('mssql');
const config = {
    user: process.env.HECAP_SQL_USER, // better stored in an app setting such as process.env.DB_USER
    password: process.env.HECAP_SQL_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
    server: process.env.HECAP_SQL_SERVER, // better stored in an app setting such as process.env.DB_SERVER
    port: parseInt(process.env.HECAP_SQL_PORT), // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: process.env.HECAP_SQL_DATABASE, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}
const NUM_DAILY_PATIENT = process.env.NUM_DAILY_PATIENT
const NUM_PATIENT_LIST = process.env.NUM_PATIENT_LIST

let pool = null;

// const getPoolConnection = async () => {
//     if (!pool) {
//         try {
//             console.log("===SQL pool connection init.......")
//             pool = await sql.connect(config);
//             console.log("===SQL pool connection success!")
//         } catch (error) {
//             pool = null
//             console.log("===SQL pool connection failed!", error)
//         }
//     }
//     console.log("===SQL pool connected already...")
//     return pool;
// };

export class HecapSqlAccess {
    public async getPoolConnection(context) {
        context.log("===getPoolConnection:pool:")
        if(pool) {
            context.log("===getPoolConnection:pool connected already...", pool.config.database)
            return pool
        } else {
            try {
                context.log("===SQL pool connection is not exist, init.......")
                pool = await sql.connect(config);
                context.log("===SQL pool connection success!", pool.config.server, pool.pool)
            } catch (error) {
                pool = null
                context.log("===SQL pool connection failed!", error)
            } finally {
                context.log("===getPoolConnection:finally:pool:", pool.pool)
                if (pool) {
                    context.log("===getPoolConnection:finally: return pool")
                    return pool
                } else {
                    context.log("===getPoolConnection:finally: pool is null, re-try after 5 second")
                    await new Promise(r => setTimeout(r, 5000));
                    pool = this.getPoolConnection(context)
                    context.log("===getPoolConnection:finally:after sleep re-connect:", pool)
                    return pool
                }
            }
        } 
    }
    public async queryPatientsByKeyword(context, keywordFN, keywordLN) {
        try {
            let sqlStatement = `SELECT TOP ${NUM_PATIENT_LIST} * FROM dbo.QUALTRICS_INTAKE_LIST p
            LEFT JOIN hs.PATIENT_STATUS s ON p.id = s.patient_dim_id
            WHERE (s.updateTime = (
                SELECT MAX(updateTime)
                FROM hs.PATIENT_STATUS
                WHERE patient_dim_id = p.id
            ) OR s.updateTime IS NULL ) `
            if(!isBlank(keywordFN)) {            
                sqlStatement = sqlStatement + ` and p.givenName like '%${keywordFN}%' `
                if(!isBlank(keywordLN)) {            
                    sqlStatement = sqlStatement + ` and p.familyName like '%${keywordLN}%'`
                }
            } else {
                if (!isBlank(keywordLN)) {
                  sqlStatement = sqlStatement + ` and p.familyName like '%${keywordLN}%' `
                }
            } 

            context.log("===queryPatientsByKeyword:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var resultSet = await pool.request().query(sqlStatement);
            context.log(`${resultSet.recordset.length} rows returned.....`);
            return resultSet.recordset
        } catch (err) {
            context.log("===queryPatientsByKeyword.Error:",err);
        }
    }
    public async queryC24PatientsByKeyword(context, keywordFN, keywordLN) {
        try {
            let sqlStatement = `SELECT TOP ${NUM_PATIENT_LIST} * FROM he.PATIENT_C24 WHERE id is not null `
            if(!isBlank(keywordFN)) {            
                sqlStatement = sqlStatement + ` and FirstName like '%${keywordFN}%' `
                if(!isBlank(keywordLN)) {            
                    sqlStatement = sqlStatement + ` and LastName like '%${keywordLN}%'`
                }
            } else {
                if (!isBlank(keywordLN)) {
                  sqlStatement = sqlStatement + ` and LastName like '%${keywordLN}%' `
                }
            } 
            sqlStatement = sqlStatement + ` Order By CreatedAt desc `

            context.log("===queryC24PatientsByKeyword:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var resultSet = await pool.request().query(sqlStatement);
            context.log(`${resultSet.recordset.length} rows returned.....`);
            return resultSet.recordset
        } catch (err) {
            context.log("===queryC24PatientsByKeyword.Error:",err);
        }
    }


    public async listDailyPatients(context) {
        try {
            let sqlStatement = `SELECT TOP ${NUM_DAILY_PATIENT} * FROM dbo.QUALTRICS_INTAKE_LIST p
            LEFT JOIN hs.PATIENT_STATUS s ON p.id = s.patient_dim_id
            WHERE s.patient_dim_id IS NULL;`
            context.log("===listDailyPatients.sql:", sqlStatement)    
            var pool = await this.getPoolConnection(context)
            var resultSet = await pool.request().query(sqlStatement);
            context.log(`===SQL listDailyPatients results: ${resultSet.recordset.length} rows returned.....`);
            // output column headers
            //var columns = "";
            //for (var column in resultSet.recordset.columns) {
            //    columns += column + ", ";
            //}
            //context.log("%s\t", columns.substring(0, columns.length - 2));
    
            // ouput row contents from default record set
            //resultSet.recordset.forEach(row => {
                //context.log(row);
            //});
    
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return resultSet.recordset
        } catch (err) {
            context.log("===listDailyPatients.err:", err.message);
        }
    }
    public async listPatients(context) {
        try {
            let sqlStatement = `SELECT TOP 1000 * FROM dbo.QUALTRICS_INTAKE_LIST p
            LEFT JOIN hs.PATIENT_STATUS s ON p.id = s.patient_dim_id
            WHERE s.updateTime = (
                SELECT MAX(updateTime)
                FROM hs.PATIENT_STATUS
                WHERE patient_dim_id = p.id
            ) OR s.updateTime IS NULL;`
            context.log("===listPatients.sql:::", sqlStatement)    
            var pool = await this.getPoolConnection(context)
            context.log("===listPatients.getPoolConnection:pool.pool.used, pool.pool.free:", pool.pool.used, pool.pool.free)
            var resultSet = await pool.request().query(sqlStatement);
    
            context.log(`===listPatients.sqlresult: ${resultSet.recordset.length} rows returned.....`);
    
            // output column headers
            // var columns = "";
            // for (var column in resultSet.recordset.columns) {
            //     columns += column + ", ";
            // }
            // context.log("%s\t", columns.substring(0, columns.length - 2));
    
            // ouput row contents from default record set
            //resultSet.recordset.forEach(row => {
                //context.log(row);
            //});
    
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return resultSet.recordset
        } catch (err) {
            context.log("===listPatients.err:", err.message);
        }
    }
    public async listPatientsC24(context) {
        try {  
            let sqlStatement = `SELECT TOP 100 * FROM he.PATIENT_C24 Order By CreatedAt desc`
            context.log("===listPatientsC24.sql:::", sqlStatement)    
            var pool = await this.getPoolConnection(context)
            context.log("===listPatientsC24.getPoolConnection:pool.pool.used, pool.pool.free:", pool.pool.used, pool.pool.free)
            var resultSet = await pool.request().query(sqlStatement);
    
            context.log(`===listPatientsC24.sqlresult: ${resultSet.recordset.length} rows returned.....`);
    
            return resultSet.recordset
        } catch (err) {
            context.log("===listPatients.err:", err.message);
        }
    }
    public async insertPatientStatus(context, id, mrn, status, updateBy, sms_email, email, group_name, phone) {
        try {
            context.log("===insertPatientStatus...", id, mrn, status, updateBy, sms_email);
            const currentDatetime = new Date().toISOString(); 
            let sqlStatement = `INSERT INTO hs.PATIENT_STATUS 
            (patient_dim_id, patient_dim_mrn, status, updateBy, 
                updateTime, sms_email, email, group_name, phone)
            VALUES ('${id}', '${mrn}', '${status}', '${updateBy}', '${currentDatetime}', 
                    '${sms_email}', '${email}', '${group_name}', '${phone}')`
            context.log("===insertPatientStatus.sql:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            context.log("===insertPatientStatus.res:", res);
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res
        } catch (err) {
            context.log("===insertPatientStatus.error!!!", err);
            return false
        }
    }
    public async insertPatient(context, sqlStatement) {
        try {
            context.log("===insertPatient...");
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            return res
        } catch (err) {
            context.log("===insertPatient.error!!!", err);
            return false
        }
    }

    public async insertSurvey(context, sqlStatement) {
        try {
            context.log("===insertSurvey...");
            // const poolConnection = await sql.connect(config);
            // context.log("===insertSurvey.poolConnected.")
            // let res = await poolConnection.request().query(sqlStatement);
            // context.log("===insertSurvey.res:", res);
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res
        } catch (err) {
            context.log("===insertSurvey.error!!!", err);
            return false
        }
    }
    public async bulkInsertSurvey(context) {
        try {
            let poolConnection = await sql.connect(config);
            const table = new sql.Table('hs.SURVEY')
            table.columns.add('pkey', sql.Int, {nullable: false, primary: true})
            table.columns.add('email', sql.VarChar(100), {nullable: true})
            table.columns.add('first_name', sql.VarChar(50), {nullable: true})
            table.columns.add('last_name', sql.VarChar(50), {nullable: true})
            table.rows.add(101, 't101@email.com', 'first101', 'last101')
            table.rows.add(102, 't102@email.com', 'first102', 'last102')
    
            //let res = await poolConnection.request().bulk(table)
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().bulk(table);

            context.log("===bulkInsertSurvey:", res)
            return true
        } catch (err) {
            context.log("===!!!bulkInsertSurvey.error:", err)
            return false
        }
    }
    public async updateSurvey(context) {
        try {
            // let poolConnection = await sql.connect(config);
            // let sqlRequest = await poolConnection.request();
            // let res = await sqlRequest.query(`
            //         update hs.survey set last_name = 'hecap2'
            //         where last_name = 'last2'`)
            var sqlStatement = `update hs.survey set last_name = 'hecap2'
                    where last_name = 'last2'`
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            context.log("===updateSurvey:", res)
            return true
        } catch(err) {
            context.log("===!!!updateSurvey.error:", err)
            return false
        }
    }
    public async deleteSurvey(context) {
        try {
            // let poolConnection = await sql.connect(config);
            // let sqlRequest = await poolConnection.request();
            // let res = await sqlRequest.query(`
            //         delete from hs.survey
            //         where last_name = 'hecap2'`)
            var sqlStatement = `delete from hs.survey where last_name = 'hecap2'`
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            context.log("===deleteSurvey:", res)
            return true
        } catch(err) {
            context.log("===!!!deleteSurvey.error:", err)
            return false
        }
    }
    public async querySurvey(context) {
        try {
            // var poolConnection = await sql.connect(config);
            // context.log("======Reading rows from the Table...");
            // var resultSet = await poolConnection.request().query(`SELECT TOP 2 * FROM [hs].[SURVEY] `);
            //context.log(`${resultSet.recordset.length} rows returned.....`);
            var sqlStatement = `SELECT TOP 2 * FROM [hs].[SURVEY]`
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            // output column headers
            var columns = "";
            for (var column in res.recordset.columns) {
                columns += column + ", ";
            }
            context.log("%s\t", columns.substring(0, columns.length - 2));

            // ouput row contents from default record set
            res.recordset.forEach(row => {
                //context.log(row);
            });

            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res.recordset
        } catch (err) {
            context.log(err.message);
        }
    }
   
}