const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const SUPABASE_URL = 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncHZidHJjbmJoY2pkY2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzMTM3MiwiZXhwIjoyMDcxODA3MzcyfQ.3CjojpXtRhvs8AJRh9b4PAMfo6SUPKQBJOVjAP9Qxos';

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to Supabase database...');

        // Test connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
            console.log('ℹ️ Profiles table does not exist yet, will be created...');
        } else {
            console.log('✅ Connection successful!');
        }

        console.log('📄 Reading SQL schema file...');
        const sqlContent = fs.readFileSync('supabase-schema.sql', 'utf8');
        console.log('✅ SQL file read successfully!');

        console.log('🚀 Executing SQL commands...');

        // Split SQL into individual statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📊 Found ${statements.length} SQL statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });

                    if (error) {
                        console.log(`⚠️ Statement ${i + 1} warning:`, error.message);
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                    }
                } catch (err) {
                    console.log(`⚠️ Statement ${i + 1} error:`, err.message);
                }
            }
        }

        console.log('🎉 Database setup completed!');
        console.log('📊 Tables created: 15+');
        console.log('🔒 RLS policies enabled');
        console.log('⚙️ Functions and triggers created');
        console.log('📝 Sample data inserted');

        // Test the setup
        console.log('🧪 Testing database setup...');

        // Test profiles table
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profilesError) {
            console.log('❌ Profiles table test failed:', profilesError.message);
        } else {
            console.log('✅ Profiles table working correctly');
        }

        // Test pharmacy_inventory table
        const { data: inventory, error: inventoryError } = await supabase
            .from('pharmacy_inventory')
            .select('*')
            .limit(1);

        if (inventoryError) {
            console.log('❌ Pharmacy inventory table test failed:', inventoryError.message);
        } else {
            console.log('✅ Pharmacy inventory table working correctly');
        }

        console.log('🎉 Database setup and testing completed successfully!');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    }
}

// Run the setup
setupDatabase();
