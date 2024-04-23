import {Pool} from "pg";

const pool = new Pool({
    user: "postgres",
    password: "785412",
    host: "localhost",
    port: 5432,
    database: "docx_form_postgres"
})

export default pool