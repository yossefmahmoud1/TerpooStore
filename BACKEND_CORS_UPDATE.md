# تحديث CORS للباك إند - Netlify Deployment

## 🔧 تحديث Program.cs في الباك إند:

### 1. تحديث CORS Policy:

```csharp
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins(
                "http://localhost:5173",           // للتطوير المحلي
                "https://your-netlify-domain.netlify.app", // لنطاق Netlify
                "https://*.netlify.app"            // لجميع نطاقات Netlify
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});
```

### 2. أو استخدام AllowAnyOrigin (للاختبار السريع):

```csharp
// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
```

## 🌐 تحديث الفرونت إند:

### 1. تحديث API URL في الفرونت إند:

```javascript
// في src/services/api.js أو ملف التكوين
const API_BASE_URL = "https://your-render-api.onrender.com/api";
```

### 2. أو إضافة متغيرات البيئة:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://your-render-api.onrender.com/api";
```

## 📋 خطوات التحديث:

### للباك إند ديفيلوبر:

1. **تحديث Program.cs** مع إعدادات CORS الجديدة
2. **إعادة نشر الباك إند** على Render
3. **اختبار CORS** مع الفرونت إند

### للفرونت إند:

1. **تحديث API URL** في ملفات الخدمة
2. **إضافة متغيرات البيئة** إذا لزم الأمر
3. **اختبار الاتصال** مع الباك إند الجديد

## 🧪 اختبار سريع:

### 1. اختبار CORS:

```bash
curl -H "Origin: https://your-netlify-domain.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-render-api.onrender.com/api/Products
```

### 2. اختبار API:

```bash
curl -X GET "https://your-render-api.onrender.com/api/Products"
```

## 📞 معلومات مطلوبة:

**أرسل للباك إند ديفيلوبر:**

```
مرحباً!

أحتاج تحديث CORS في الباك إند ليقبل نطاق Netlify.

المطلوب:
1. تحديث CORS policy في Program.cs
2. إضافة نطاق Netlify (https://*.netlify.app)
3. إعادة نشر الباك إند

شكراً!
```
