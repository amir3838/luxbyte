#!/usr/bin/env node

/**
 * LUXBYTE Secret Scanner
 * فاحص الأسرار في LUXBYTE
 *
 * يبحث عن أنماط الأسرار الشائعة في الكود
 */

const fs = require('fs');
const path = require('path');

// أنماط الأسرار للبحث عنها
const secretPatterns = [
  // API Keys
  { pattern: /api[_-]?key\s*[:=]\s*['"`][^'"`\s]{20,}['"`]/gi, name: 'API Key' },
  { pattern: /secret\s*[:=]\s*['"`][^'"`\s]{20,}['"`]/gi, name: 'Secret' },
  { pattern: /token\s*[:=]\s*['"`][^'"`\s]{20,}['"`]/gi, name: 'Token' },

  // Supabase
  { pattern: /supabase.*service[_-]?role/gi, name: 'Supabase Service Role' },
  { pattern: /supabase.*secret/gi, name: 'Supabase Secret' },

  // GitHub
  { pattern: /ghp_[A-Za-z0-9]{36,}/g, name: 'GitHub Personal Access Token' },

  // Stripe
  { pattern: /sk_live_[A-Za-z0-9]{24,}/g, name: 'Stripe Live Secret Key' },
  { pattern: /sk_test_[A-Za-z0-9]{24,}/g, name: 'Stripe Test Secret Key' },

  // Private Keys
  { pattern: /-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----/g, name: 'Private Key' },

  // JWT Secrets
  { pattern: /jwt[_-]?secret\s*[:=]\s*['"`][^'"`\s]{20,}['"`]/gi, name: 'JWT Secret' },

  // Database URLs
  { pattern: /postgresql:\/\/[^:]+:[^@]+@/g, name: 'Database URL with credentials' },
  { pattern: /mongodb:\/\/[^:]+:[^@]+@/g, name: 'MongoDB URL with credentials' },

  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key ID' },
  { pattern: /aws[_-]?secret[_-]?access[_-]?key/gi, name: 'AWS Secret Access Key' },

  // Generic patterns
  { pattern: /password\s*[:=]\s*['"`][^'"`\s]{8,}['"`]/gi, name: 'Password' },
  { pattern: /passwd\s*[:=]\s*['"`][^'"`\s]{8,}['"`]/gi, name: 'Password' },
];

// ملفات ومجلدات يجب تجاهلها
const ignorePatterns = [
  /node_modules/,
  /\.git/,
  /\.vscode/,
  /\.idea/,
  /dist/,
  /build/,
  /coverage/,
  /\.nyc_output/,
  /\.cache/,
  /\.parcel-cache/,
  /\.next/,
  /\.nuxt/,
  /\.vercel/,
  /\.supabase/,
  /yarn\.lock/,
  /package-lock\.json/,
  /\.env\.example/,
  /\.gitignore/,
  /README\.md/,
  /CHANGELOG\.md/,
  /LICENSE/,
  /\.secretlintrc\.json/,
  /scripts\/scan-secrets\.js/,
  /SECURITY\.md/,
  /scripts\/supabase-setup\.sh/,
  /api\//, // ملفات API تستخدم process.env بشكل صحيح
];

// أنماط آمنة (مفاتيح عامة أو متغيرات بيئة)
const safePatterns = [
  /process\.env\./g, // متغيرات البيئة
  /NEXT_PUBLIC_/g, // مفاتيح Next.js العامة
  /your-.*-key-here/g, // أمثلة في الوثائق
  /AIzaSy[A-Za-z0-9_-]{35}/g, // Firebase API keys (عامة)
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, // JWT tokens (عامة)
];

// امتدادات الملفات للفحص
const allowedExtensions = ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.json', '.md', '.yml', '.yaml', '.sh', '.ps1'];

let foundSecrets = [];

function shouldIgnoreFile(filePath) {
  // تجاهل مجلد api بالكامل
  if (filePath.includes('/api/') || filePath.includes('\\api\\')) {
    return true;
  }
  return ignorePatterns.some(pattern => pattern.test(filePath));
}

function hasAllowedExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return allowedExtensions.includes(ext);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // تخطي الأنماط الآمنة
      const isSafeLine = safePatterns.some(safePattern => safePattern.test(line));
      if (isSafeLine) return;

      secretPatterns.forEach(({ pattern, name }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // تحقق إضافي من أن المطابقة ليست آمنة
            const isSafeMatch = safePatterns.some(safePattern => safePattern.test(match));
            if (!isSafeMatch) {
              foundSecrets.push({
                file: filePath,
                line: index + 1,
                secret: match,
                type: name,
                context: line.trim()
              });
            }
          });
        }
      });
    });
  } catch (error) {
    console.warn(`⚠️  تعذر قراءة الملف: ${filePath} - ${error.message}`);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!shouldIgnoreFile(fullPath)) {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        if (!shouldIgnoreFile(fullPath) && hasAllowedExtension(fullPath)) {
          scanFile(fullPath);
        }
      }
    });
  } catch (error) {
    console.warn(`⚠️  تعذر فحص المجلد: ${dirPath} - ${error.message}`);
  }
}

function main() {
  console.log('🔍 بدء فحص الأسرار في LUXBYTE...\n');

  const startDir = process.cwd();
  scanDirectory(startDir);

  if (foundSecrets.length === 0) {
    console.log('✅ لم يتم العثور على أسرار في الكود!');
    process.exit(0);
  }

  console.log(`❌ تم العثور على ${foundSecrets.length} مشتبه به:\n`);

  foundSecrets.forEach((secret, index) => {
    console.log(`${index + 1}. ${secret.type}`);
    console.log(`   الملف: ${secret.file}`);
    console.log(`   السطر: ${secret.line}`);
    console.log(`   السياق: ${secret.context}`);
    console.log(`   المشتبه به: ${secret.secret.substring(0, 20)}...`);
    console.log('');
  });

  console.log('🚨 يرجى مراجعة هذه الملفات وإزالة أي أسرار حقيقية!');
  process.exit(1);
}

// تشغيل الفحص
main();