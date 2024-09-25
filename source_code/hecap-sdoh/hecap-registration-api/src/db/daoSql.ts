const {isBlank} = require('../comm/commHecap')
const {getEncryptionKey, encryptData, decryptData} = require('./encryption')
const sql = require('mssql');
const config = {
    user: process.env.HECAP_SQL_USER_HE, // better stored in an app setting such as process.env.DB_USER
    password: process.env.HECAP_SQL_PASSWORD_HE, // better stored in an app setting such as process.env.DB_PASSWORD
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
const HECAP_PATIENT_GROUP = process.env.HECAP_PATIENT_GROUP
const HECAP_NUM_PATIENT_SQL = process.env.HECAP_NUM_PATIENT_SQL

let pool = null;
//console.log("=========db config:", config.server, config.database, config.user)
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
                //context.log("===SQL pool connection success!", pool.config.server, pool.pool)
                context.log("===SQL pool connection success!", pool.config.server)
            } catch (error) {
                pool = null
                context.log("===SQL pool connection failed!", error)
            } finally {
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

    public async listHecapPatients(context) {
        try {
            let results = []
            let sqlStatement = `SELECT TOP ${HECAP_NUM_PATIENT_SQL} e.hecap_id, e.createdAt, e.firstname, e.lastname, 
                                e.email, e.phone, e.group_name, e.birthdate, e.signature, 
                                s.answer1, s.answer2,s.answer3,s.answer4,s.answer5,s.answer6,s.answer7,s.answer8, s.more_research 
                                FROM he.HECAP_PATIENT_ENCRYPT e LEFT JOIN he.HECAP_SURVEY_SDOH s 
                                ON e.hecap_id = s.patient_id 
                                WHERE e.firstname is not null 
                                ORDER BY e.createdAt DESC `
            //context.log("===listPatients.sql:::SELECT TOP ", HECAP_NUM_PATIENT_SQL)    
            var pool = await this.getPoolConnection(context)
            //context.log("===listPatients.getPoolConnection:pool.pool.used, pool.pool.free:", pool.pool.used, pool.pool.free)
            var resultSet = await pool.request().query(sqlStatement);
    
            const key = await getEncryptionKey(context)
            //let enEmail = decryptData(email, key)

            //context.log(`===listPatients.sqlresult: ${resultSet.recordset.length} rows returned.....`, resultSet);
    
            // output column headers
            // var columns = "";
            // for (var column in resultSet.recordset.columns) {
            //     columns += column + ", ";
            // }
            // context.log("%s\t", columns.substring(0, columns.length - 2));
    
            // ouput row contents from default record set
            resultSet.recordset.forEach(row => {
                let firstname = decryptData(row.firstname, key)
                let lastname = decryptData(row.firstname, key)
                let email =  decryptData(row.email, key)
                let phone =  decryptData(row.phone, key)
                let birthdate =  decryptData(row.birthdate, key)
                let signature =  decryptData(row.signature, key)
                let patient = {
                    "pId": row.hecap_id,
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email,
                    "phone": phone,
                    "birthdate": birthdate,
                    "sms_email": row.sms_email,
                    "groupname": row.group_name,
                    "createdAt": row.createdAt,
                    "answer1": row.answer1,
                    "answer2": row.answer2,
                    "answer3": row.answer3,
                    "answer4": row.answer4,
                    "answer5": row.answer5,
                    "answer6": row.answer6,
                    "answer7": row.answer7,
                    "answer8": row.answer8,
                    "more_research": row.more_research,
                    "signature": signature
                }
                results.push(patient)

            });
    
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return results
        } catch (err) {
            context.log("===listPatients.err:", err.message);
        }
    }

    public async insertHecapPatient(context, data) {
        try {

            const key = await getEncryptionKey(context)
            let enFirstName = encryptData(data.firstname, key)
            let enLastName = encryptData(data.lastname, key)
            let enEmail = encryptData(data.email, key)
            let enPhone = encryptData(data.phone, key)
            let enBirthdate = encryptData(data.birthdate, key)
            let enSignature = encryptData(data.signature, key)
            let sms_email = data.sms_email
            let hecap_group_name = data.group_name || HECAP_PATIENT_GROUP
            const currentDatetime = new Date().toISOString(); 
            let sqlStatement = `INSERT INTO he.HECAP_PATIENT_ENCRYPT
            (hecap_id, firstname, lastname, email, phone, group_name, birthdate, createdAt, signature, sms_email)
            VALUES ('${data.hecap_id}', '${enFirstName}', '${enLastName}', 
                    '${enEmail}', '${enPhone}', '${hecap_group_name}', 
                    '${enBirthdate}', '${currentDatetime}', '${enSignature}', '${sms_email}')`
            //context.log("===insertHecapPatient.sql:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            //context.log("===insertHecapPatient.res:", res);
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res
        } catch (err) {
            context.log("===insertHecapPatient.error!!!", err);
            return false
        }
    }

    public async insertPatientStatus(context, id, mrn, status, updateBy, groupName, sms_email, email, phone) {
        try {
            //context.log("===insertPatientStatus...", id, mrn, status, updateBy, sms_email);
            const key = await getEncryptionKey(context)
            let enEmail = encryptData(email, key)
            let enPhone = encryptData(phone, key)
            let group_name = groupName || HECAP_PATIENT_GROUP

            const currentDatetime = new Date().toISOString(); 

            let sqlStatement = `INSERT INTO he.HECAP_PATIENT_STATUS 
            (patient_dim_id, patient_dim_mrn, status, updateBy, updateTime, 
             sms_email, email, group_name, phone)
            VALUES ('${id}', '${mrn}', '${status}', '${updateBy}', '${currentDatetime}', 
            '${sms_email}', '${enEmail}', '${group_name}', '${enPhone}')`
            //context.log("===insertPatientStatus.sql:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            //context.log("===insertPatientStatus.res:", res);
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res
        } catch (err) {
            context.log("===insertPatientStatus.error!!!", err);
            return false
        }
    }

    public async insertSDOHSurvey(context, hecap_id, surveyPayload) {
        try {
            const currentDatetime = new Date().toISOString(); 
            let sqlStatement = `INSERT INTO he.HECAP_SURVEY_SDOH 
            (patient_id, patient_dim_mrn, updateTime, 
             answer1, answer2, answer3, answer4, answer5, answer6, answer7, 
             want_upcoming_program, want_rush_support, reason_rush_offer, reason_share_info, 
             age, gender, ethnicity, race)
            VALUES ('${hecap_id}', '${hecap_id}',  '${currentDatetime}', 
                   '${surveyPayload.surveyAnswers.answer1}', '${surveyPayload.surveyAnswers.answer2}', '${surveyPayload.surveyAnswers.answer3}', 
                   '${surveyPayload.surveyAnswers.answer4}', '${surveyPayload.surveyAnswers.answer5}', '${surveyPayload.surveyAnswers.answer6}', 
                   '${surveyPayload.surveyAnswers.answer7}', '${surveyPayload.wantUpcomingProgram}', '${surveyPayload.wantRushSupport}',
                   '${surveyPayload.reasonRushOffer}', '${surveyPayload.reasonShareInfo}', 
                   '${surveyPayload.demographyData.age}', '${surveyPayload.demographyData.gender}', 
                   '${surveyPayload.demographyData.ethnicity}', '${surveyPayload.demographyData.race}')`
            //context.log("===insertPatientStatus.sql:", sqlStatement)
            var pool = await this.getPoolConnection(context)
            var res = await pool.request().query(sqlStatement);
            //context.log("===insertPatientStatus.res:", res);
            // close connection only when we're certain application is finished
            //poolConnection.close();
            return res
        } catch (err) {
            context.log("===insertSDOHSurvey.error!!!", err);
            return false
        }
    }



    public async getLastHecapPatienId(context) {
        try {
            let sqlStatement = `SELECT TOP 1 hecap_id FROM he.HECAP_PATIENT_ENCRYPT r ORDER BY hecap_id desc`
            //context.log("===getHecapPatienId.sql:::", sqlStatement)    
            let pool = await this.getPoolConnection(context)
            let resultSet = await pool.request().query(sqlStatement);
            //context.log(`===getHecapPatienId.sqlresult: ${resultSet.recordset.length} rows returned.....`, resultSet);
            let hecap_id = resultSet.recordset[0].hecap_id
            let next_hecap_id = this.getNextId(hecap_id)
            return next_hecap_id
        } catch (err) {
            context.log("===getLastHecapPatienId.err:", err.message);
        }
    }

    public getNextId(hecap_id) {
        let numString = hecap_id.substring(1)
        let num = parseInt(numString) + 1
        return 'C' + num
    }

}