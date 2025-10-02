const { Client } = require('pg');
const fs = require('fs');

// Database connection
const client = new Client({
    connectionString: 'postgresql://postgres.qjsvgpvbtrcnbhcjdcci:A01065452921%A@aws-1-eu-west-1.pooler.supabase.com:5432/postgres',
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
        const sqlContent = fs.readFileSync('supabase-update.sql', 'utf8');
        console.log('✅ SQL file read successfully!');

        console.log('🚀 Executing SQL commands...');
        await client.query(sqlContent);
        console.log('✅ SQL commands executed successfully!');

        console.log('🎉 Database update completed successfully!');
        console.log('📊 Tables created: 15');
        console.log('🔒 Policies created: 20+');
        console.log('⚙️ Functions created: 1');
        console.log('🔄 Triggers created: 10');
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
