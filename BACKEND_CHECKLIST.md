# ✅ قائمة تحقق الباك إند - TerpooStore

## 🚨 المطلوب فوراً:

### 1. قاعدة البيانات:

```sql
-- إضافة حقل PurchaseCount
ALTER TABLE Products ADD PurchaseCount INT DEFAULT 0;
```

### 2. Model التحديث:

```csharp
public class Product
{
    // ... الحقول الموجودة
    public int PurchaseCount { get; set; } = 0;
}
```

### 3. API Endpoints المطلوبة:

#### أ) زيادة عدد المشتريات:

```csharp
[HttpPost("{id}/increment-purchase")]
public async Task<IActionResult> IncrementPurchaseCount(int id)
{
    var product = await _productService.GetByIdAsync(id);
    if (product == null)
        return NotFound();

    product.PurchaseCount++;
    await _productService.UpdateAsync(product);

    return Ok(product);
}
```

#### ب) جلب المنتجات الأكثر طلباً:

```csharp
[HttpGet("most-requested")]
public async Task<IActionResult> GetMostRequestedProducts()
{
    var products = await _productService.GetMostRequestedAsync();
    return Ok(products);
}
```

### 4. إعدادات CORS:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

app.UseCors("AllowAll");
```

## 🧪 اختبار سريع:

### 1. افتح ملف `test-backend.html` في المتصفح

### 2. أدخل URL الباك إند

### 3. اضغط "Test All APIs"

## 📋 قائمة التحقق:

- [ ] حقل PurchaseCount موجود في قاعدة البيانات
- [ ] Model محدث
- [ ] API endpoint لزيادة المشتريات يعمل
- [ ] API endpoint للمنتجات الأكثر طلباً يعمل
- [ ] CORS مفعل
- [ ] معالجة الأخطاء موجودة
- [ ] اختبار جميع الـ APIs نجح

## 🔧 إذا واجهت مشاكل:

### خطأ 404:

- تأكد من صحة الـ route
- تأكد من تسجيل الـ controller

### خطأ 500:

- تحقق من الـ logs
- تأكد من اتصال قاعدة البيانات

### خطأ CORS:

- تأكد من إضافة CORS middleware
- تأكد من ترتيب الـ middleware

## 📞 للتواصل:

- أرسل URL الباك إند جاهز
- أرسل نتائج الاختبار
- أرسل أي أخطاء تواجهها

## ⚡ اختبار سريع:

```bash
# اختبار جلب المنتجات
curl -X GET "https://your-api.com/api/Products"

# اختبار جلب الأكثر طلباً
curl -X GET "https://your-api.com/api/Products/most-requested"

# اختبار زيادة المشتريات
curl -X POST "https://your-api.com/api/Products/1/increment-purchase"
```
