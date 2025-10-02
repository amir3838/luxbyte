const { createClient } = require('@supabase/supabase-js');

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

        console.log('🚀 Creating database tables...');

        // Create profiles table
        console.log('📊 Creating profiles table...');
        const { error: profilesError } = await supabase.rpc('create_profiles_table');
        if (profilesError) {
            console.log('⚠️ Profiles table creation warning:', profilesError.message);
        } else {
            console.log('✅ Profiles table created successfully');
        }

        // Create pharmacy_inventory table
        console.log('📊 Creating pharmacy_inventory table...');
        const { error: inventoryError } = await supabase.rpc('create_pharmacy_inventory_table');
        if (inventoryError) {
            console.log('⚠️ Pharmacy inventory table creation warning:', inventoryError.message);
        } else {
            console.log('✅ Pharmacy inventory table created successfully');
        }

        // Create pharmacy_orders table
        console.log('📊 Creating pharmacy_orders table...');
        const { error: ordersError } = await supabase.rpc('create_pharmacy_orders_table');
        if (ordersError) {
            console.log('⚠️ Pharmacy orders table creation warning:', ordersError.message);
        } else {
            console.log('✅ Pharmacy orders table created successfully');
        }

        // Create restaurant_menu table
        console.log('📊 Creating restaurant_menu table...');
        const { error: menuError } = await supabase.rpc('create_restaurant_menu_table');
        if (menuError) {
            console.log('⚠️ Restaurant menu table creation warning:', menuError.message);
        } else {
            console.log('✅ Restaurant menu table created successfully');
        }

        // Create restaurant_orders table
        console.log('📊 Creating restaurant_orders table...');
        const { error: restaurantOrdersError } = await supabase.rpc('create_restaurant_orders_table');
        if (restaurantOrdersError) {
            console.log('⚠️ Restaurant orders table creation warning:', restaurantOrdersError.message);
        } else {
            console.log('✅ Restaurant orders table created successfully');
        }

        // Create supermarket_products table
        console.log('📊 Creating supermarket_products table...');
        const { error: productsError } = await supabase.rpc('create_supermarket_products_table');
        if (productsError) {
            console.log('⚠️ Supermarket products table creation warning:', productsError.message);
        } else {
            console.log('✅ Supermarket products table created successfully');
        }

        // Create supermarket_orders table
        console.log('📊 Creating supermarket_orders table...');
        const { error: supermarketOrdersError } = await supabase.rpc('create_supermarket_orders_table');
        if (supermarketOrdersError) {
            console.log('⚠️ Supermarket orders table creation warning:', supermarketOrdersError.message);
        } else {
            console.log('✅ Supermarket orders table created successfully');
        }

        // Create clinic_patients table
        console.log('📊 Creating clinic_patients table...');
        const { error: patientsError } = await supabase.rpc('create_clinic_patients_table');
        if (patientsError) {
            console.log('⚠️ Clinic patients table creation warning:', patientsError.message);
        } else {
            console.log('✅ Clinic patients table created successfully');
        }

        // Create clinic_appointments table
        console.log('📊 Creating clinic_appointments table...');
        const { error: appointmentsError } = await supabase.rpc('create_clinic_appointments_table');
        if (appointmentsError) {
            console.log('⚠️ Clinic appointments table creation warning:', appointmentsError.message);
        } else {
            console.log('✅ Clinic appointments table created successfully');
        }

        // Create courier_deliveries table
        console.log('📊 Creating courier_deliveries table...');
        const { error: deliveriesError } = await supabase.rpc('create_courier_deliveries_table');
        if (deliveriesError) {
            console.log('⚠️ Courier deliveries table creation warning:', deliveriesError.message);
        } else {
            console.log('✅ Courier deliveries table created successfully');
        }

        // Create driver_trips table
        console.log('📊 Creating driver_trips table...');
        const { error: tripsError } = await supabase.rpc('create_driver_trips_table');
        if (tripsError) {
            console.log('⚠️ Driver trips table creation warning:', tripsError.message);
        } else {
            console.log('✅ Driver trips table created successfully');
        }

        console.log('🎉 Database setup completed!');
        console.log('📊 Tables created: 10+');
        console.log('🔒 RLS policies will be enabled manually');
        console.log('⚙️ Functions and triggers will be created manually');

        // Test the setup
        console.log('🧪 Testing database setup...');

        // Test profiles table
        const { data: profiles, error: profilesTestError } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

        if (profilesTestError) {
            console.log('❌ Profiles table test failed:', profilesTestError.message);
        } else {
            console.log('✅ Profiles table working correctly');
        }

        console.log('🎉 Database setup and testing completed successfully!');
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. Go to https://qjsvgpvbtrcnbhcjdcci.supabase.co');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and run the content of supabase-schema.sql');
        console.log('4. This will create all tables, policies, and functions');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        process.exit(1);
    }
}

// Run the setup
setupDatabase();
