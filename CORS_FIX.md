# 🚨 إصلاح CORS عاجل - الباك إند

## ❌ **المشكلة الحالية:**

```
Access to XMLHttpRequest at 'https://terpoo-store-api.onrender.com/api/Products'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ **الحل المطلوب:**

### **1. تحديث ملف Program.cs:**

```csharp
// في قسم AddCors
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => policy
        .AllowAnyOrigin()  // للاختبار السريع
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});
```

### **2. أو تحديد النطاقات المحددة:**

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => policy
        .WithOrigins(
            "http://localhost:5173",
            "https://*.netlify.app",
            "https://terpoo-store.netlify.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});
```

### **3. تأكد من استخدام CORS في Pipeline:**

```csharp
// في قسم Configure
app.UseCors("AllowFrontend");
```

## 🚀 **الخطوات:**

1. **افتح ملف Program.cs**
2. **ابحث عن AddCors**
3. **استبدل الكود الحالي بالكود أعلاه**
4. **احفظ الملف**
5. **أعد نشر الباك إند على Render**

## 📋 **الـ APIs المطلوبة:**

| API                                     | الطريقة | الوصف                 |
| --------------------------------------- | ------- | --------------------- |
| `/api/Products`                         | GET     | جلب جميع المنتجات     |
| `/api/Categories`                       | GET     | جلب جميع الفئات       |
| `/api/Products/{id}/increment-purchase` | POST    | زيادة عدد المشتريات   |
| `/api/Products/most-requested`          | GET     | المنتجات الأكثر طلباً |

## ⚡ **اختبار سريع:**

بعد التحديث، اختبر هذا الـ URL:

```
https://terpoo-store-api.onrender.com/api/Products
```

يجب أن يعطي JSON response بدلاً من CORS error.

## 🎯 **ملاحظات مهمة:**

- **AllowAnyOrigin()** - للاختبار السريع
- **WithOrigins()** - للإنتاج (أكثر أماناً)
- **أعد النشر فوراً** - المشكلة عاجلة
- **اختبر الـ APIs** - تأكد من عملها

---

**🚨 هذه مشكلة عاجلة! يرجى الإصلاح فوراً!**
