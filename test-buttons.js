// اختبار سريع لأزرار الثيم واللغة
console.log('🧪 Testing Theme and Language Buttons...');

// اختبار أزرار الثيم
const themeButton = document.querySelector('#themeToggle, [data-action="toggle-theme"]');
if (themeButton) {
    console.log('✅ Theme button found:', themeButton.textContent);
    console.log('   - Should show ☀️ or 🌙');
} else {
    console.log('❌ Theme button not found');
}

// اختبار أزرار اللغة
const langButton = document.querySelector('#langToggle, [data-action="toggle-lang"]');
if (langButton) {
    console.log('✅ Language button found:', langButton.textContent);
    console.log('   - Should show 🇸🇦 or 🇬🇧');
} else {
    console.log('❌ Language button not found');
}

// اختبار الوظائف
console.log('\n🔧 Testing Functions...');

// اختبار تبديل الثيم
if (themeButton) {
    console.log('Testing theme toggle...');
    themeButton.click();
    setTimeout(() => {
        console.log('Theme after click:', themeButton.textContent);
    }, 100);
}

// اختبار تبديل اللغة
if (langButton) {
    console.log('Testing language toggle...');
    langButton.click();
    setTimeout(() => {
        console.log('Language after click:', langButton.textContent);
    }, 100);
}

console.log('\n🎉 Button test completed!');
