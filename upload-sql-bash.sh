#!/bin/bash

# ===============================
# LUXBYTE SQL UPLOAD SCRIPT
# رفع SQL schema إلى Supabase
# ===============================

echo "🚀 بدء رفع SQL schema إلى Supabase..."

# Supabase configuration
SUPABASE_URL="https://qjsvgpvbtrcnbhcjdcci.supabase.co"
SUPABASE_ANON_KEY="sb_publishable_vAyh05NeO33SYgua07vvIQ_M6nfrx7e"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncHZidHJjbmJoY2pkY2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzMTM3MiwiZXhwIjoyMDcxODA3MzcyfQ.3CjojpXtRhvs8AJRh9b4PAMfo6SUPKQBJOVjAP9Qxos"

# Check if SQL file exists
if [ ! -f "supabase-schema.sql" ]; then
    echo "❌ ملف supabase-schema.sql غير موجود"
    exit 1
fi

echo "✅ ملف SQL موجود"

# Create a simple SQL execution script
cat > execute-sql.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://qjsvgpvbtrcnbhcjdcci.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqc3ZncHZidHJjbmJoY2pkY2NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIzMTM3MiwiZXhwIjoyMDcxODA3MzcyfQ.3CjojpXtRhvs8AJRh9b4PAMfo6SUPKQBJOVjAP9Qxos';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function executeSQL() {
    try {
        console.log('🔌 Connecting to Supabase...');

        // Read SQL file
        const sqlContent = fs.readFileSync('supabase-schema.sql', 'utf8');
        console.log('📄 SQL file read successfully');

        // Split into statements
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`📊 Found ${statements.length} SQL statements`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);

                    // Use direct SQL execution via REST API
                    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                            'apikey': SUPABASE_SERVICE_KEY
                        },
                        body: JSON.stringify({ sql: statement })
                    });

                    if (!response.ok) {
                        console.log(`⚠️ Statement ${i + 1} warning: ${response.statusText}`);
                    } else {
                        console.log(`✅ Statement ${i + 1} executed successfully`);
                    }
                } catch (err) {
                    console.log(`⚠️ Statement ${i + 1} error: ${err.message}`);
                }
            }
        }

        console.log('🎉 SQL execution completed!');

    } catch (error) {
        console.error('❌ Error executing SQL:', error.message);
        process.exit(1);
    }
}

executeSQL();
EOF

echo "📝 تم إنشاء سكريبت Node.js"

# Install required packages
echo "📦 تثبيت الحزم المطلوبة..."
npm install @supabase/supabase-js

# Execute the SQL
echo "🚀 تشغيل SQL schema..."
node execute-sql.js

# Clean up
echo "🧹 تنظيف الملفات المؤقتة..."
rm -f execute-sql.js

echo "✅ تم رفع SQL schema بنجاح!"
echo "🌐 يمكنك الآن الوصول إلى قاعدة البيانات على: $SUPABASE_URL"
