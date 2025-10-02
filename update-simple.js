const { Client } = require('pg');
const fs = require('fs');

// Database connection
const client = new Client({
    connectionString: 'postgresql://postgres:A01065452921%25A@db.qjsvgpvbtrcnbhcjdcci.supabase.co:5432/postgres?sslmode=require',
    ssl: {
        rejectUnauthorized: false
    }
});

async function updateDatabase() {
    try {
        console.log('🔌 Connecting to Supabase database...');
        await client.connect();
        console.log('✅ Connected successfully!');

        console.log('📄 Reading SQL file...');
        const sqlContent = fs.readFileSync('simple-update.sql', 'utf8');
        console.log('✅ SQL file read successfully!');

        console.log('🚀 Executing SQL commands...');
        await client.query(sqlContent);
        console.log('✅ SQL commands executed successfully!');

        console.log('🎉 Database update completed successfully!');
        console.log('📊 Tables created/updated');
        console.log('🔒 RLS policies enabled');
        console.log('📝 Sample data inserted');

    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        process.exit(1);
    } finally {
        await client.end();
        console.log('🔌 Database connection closed');
    }
}

updateDatabase();
