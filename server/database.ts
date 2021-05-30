import * as mysql from 'mysql2';
const pool = mysql
  .createPool({
    host: 'sql4.freemysqlhosting.net',
    database: 'sql4415943',
    user: 'sql4415943',
    password: 'n4rQB2CUZG',
  })
  .promise();
export default pool;
