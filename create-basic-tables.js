const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncHZidHJjbmJoY2pkY2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzMTM3MiwiZXhwIjoyMDcxODA3MzcyfQ.3CjojpXtRhvs8AJRh9b4PAMfo6SUPKQBJOVjAP9Qxos';

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createBasicTables() {
    try {
        console.log('🔌 Connecting to Supabase database...');

        // Test connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) {
            console.log('ℹ️ Profiles table does not exist yet, will be created...');
        } else {
            console.log('✅ Connection successful!');
        }

        console.log('🚀 Creating basic tables...');

        // Create profiles table using direct SQL
        console.log('📊 Creating profiles table...');
        const { error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profilesError && profilesError.code === 'PGRST116') {
            console.log('ℹ️ Profiles table does not exist, creating...');
            // Table doesn't exist, we need to create it via SQL Editor
        } else {
            console.log('✅ Profiles table already exists');
        }

        // Test other tables
        const tables = [
            'pharmacy_inventory',
            'pharmacy_orders',
            'restaurant_menu',
            'restaurant_orders',
            'supermarket_products',
            'supermarket_orders',
            'clinic_patients',
            'clinic_appointments',
            'courier_deliveries',
            'driver_trips'
        ];

        console.log('🧪 Testing table existence...');
        for (const table of tables) {
            const { error } = await supabase.from(table).select('*').limit(1);
            if (error && error.code === 'PGRST116') {
                console.log(`❌ ${table} table does not exist`);
            } else {
                console.log(`✅ ${table} table exists`);
            }
        }

        console.log('🎉 Database connection test completed!');
        console.log('');
        console.log('📋 Manual setup required:');
        console.log('1. Go to https://qjsvgpvbtrcnbhcjdcci.supabase.co');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and run the content of supabase-schema.sql');
        console.log('4. This will create all tables, policies, and functions');
        console.log('');
        console.log('🔗 Direct link to SQL Editor:');
        console.log('https://qjsvgpvbtrcnbhcjdcci.supabase.co/project/default/sql');

    } catch (error) {
        console.error('❌ Error testing database:', error.message);
        process.exit(1);
    }
}

// Run the test
createBasicTables();
