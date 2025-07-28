# دليل النشر على Netlify

## الميزات المضافة:

- ✅ تتبع المنتجات الأكثر طلباً
- ✅ تاب جديد في الداشبورد لعرض الإحصائيات
- ✅ تحسين تجاوب الموقع للهواتف
- ✅ فلترة محسنة في الشوب

## خطوات النشر:

### 1. رفع المشروع على GitHub:

```bash
git add .
git commit -m "Add most requested products feature and mobile responsiveness"
git push origin main
```

### 2. النشر على Netlify:

#### الطريقة الأولى: عبر GitHub

1. اذهب إلى [netlify.com](https://netlify.com)
2. اضغط على "New site from Git"
3. اختر GitHub واختر repository المشروع
4. اترك الإعدادات الافتراضية:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. اضغط "Deploy site"

#### الطريقة الثانية: عبر Drag & Drop

1. اذهب إلى [netlify.com](https://netlify.com)
2. اسحب مجلد `dist` إلى منطقة النشر
3. انتظر حتى يتم النشر

### 3. إعدادات إضافية:

#### إضافة متغيرات البيئة (إذا لزم الأمر):

- اذهب إلى Site settings > Environment variables
- أضف متغيرات API إذا كانت مطلوبة

#### إعداد النطاق المخصص:

- اذهب إلى Site settings > Domain management
- أضف نطاقك المخصص

## الملفات المضافة:

- `netlify.toml` - تكوين النشر
- `public/_redirects` - إعادة توجيه للـ SPA
- `DEPLOYMENT.md` - هذا الدليل

## ملاحظات مهمة:

- تأكد من أن API endpoints تعمل بشكل صحيح
- تأكد من إعدادات CORS في الباك إند
- اختبر الموقع بعد النشر

## الميزات الجاهزة:

- 🛍️ متجر متكامل مع فلترة متقدمة
- 📊 داشبورد إداري مع إحصائيات
- 📱 تصميم متجاوب للهواتف
- 🔍 تتبع المنتجات الأكثر طلباً
- ⚡ أداء محسن
