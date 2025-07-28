# دليل اختبار الباك إند

## 1. اختبار الـ API Endpoints الأساسية:

### اختبار جلب المنتجات:

```bash
GET https://your-api-domain.com/api/Products
```

### اختبار جلب المنتجات الأكثر طلباً:

```bash
GET https://your-api-domain.com/api/Products/most-requested
```

### اختبار زيادة عدد المشتريات:

```bash
POST https://your-api-domain.com/api/Products/{productId}/increment-purchase
Content-Type: application/json
```

### اختبار جلب الفئات:

```bash
GET https://your-api-domain.com/api/Categories
```

## 2. اختبار باستخدام Postman:

### إعداد Collection جديد:

1. افتح Postman
2. أنشئ Collection جديد باسم "TerpooStore API"
3. أضف المتغيرات التالية:
   - `baseUrl`: `https://your-api-domain.com/api`
   - `productId`: `1` (أو أي ID منتج موجود)

### اختبارات مطلوبة:

#### 1. جلب جميع المنتجات:

```
GET {{baseUrl}}/Products
```

#### 2. جلب المنتجات الأكثر طلباً:

```
GET {{baseUrl}}/Products/most-requested
```

#### 3. زيادة عدد المشتريات:

```
POST {{baseUrl}}/Products/{{productId}}/increment-purchase
```

#### 4. جلب الفئات:

```
GET {{baseUrl}}/Categories
```

## 3. اختبار باستخدام cURL:

### جلب المنتجات:

```bash
curl -X GET "https://your-api-domain.com/api/Products" \
  -H "Content-Type: application/json"
```

### جلب المنتجات الأكثر طلباً:

```bash
curl -X GET "https://your-api-domain.com/api/Products/most-requested" \
  -H "Content-Type: application/json"
```

### زيادة عدد المشتريات:

```bash
curl -X POST "https://your-api-domain.com/api/Products/1/increment-purchase" \
  -H "Content-Type: application/json"
```

## 4. اختبار CORS:

### تأكد من إعدادات CORS في الباك إند:

```csharp
// في Program.cs أو Startup.cs
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

## 5. اختبار قاعدة البيانات:

### تأكد من وجود حقل PurchaseCount:

```sql
-- فحص جدول المنتجات
SELECT TOP 10 * FROM Products;

-- فحص حقل PurchaseCount
SELECT Id, Name, PurchaseCount FROM Products WHERE PurchaseCount > 0;
```

### إضافة بيانات تجريبية:

```sql
-- تحديث بعض المنتجات لاختبار الميزة
UPDATE Products
SET PurchaseCount = 5
WHERE Id = 1;

UPDATE Products
SET PurchaseCount = 3
WHERE Id = 2;
```

## 6. اختبار الأداء:

### اختبار سرعة الاستجابة:

```bash
# اختبار سرعة جلب المنتجات
curl -w "@curl-format.txt" -o /dev/null -s "https://your-api-domain.com/api/Products"
```

### ملف curl-format.txt:

```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

## 7. قائمة التحقق:

### ✅ اختبارات مطلوبة:

- [ ] جلب المنتجات يعمل
- [ ] جلب الفئات يعمل
- [ ] جلب المنتجات الأكثر طلباً يعمل
- [ ] زيادة عدد المشتريات يعمل
- [ ] CORS يعمل مع الفرونت إند
- [ ] قاعدة البيانات تحتوي على حقل PurchaseCount
- [ ] سرعة الاستجابة مقبولة (< 2 ثانية)

### ❌ مشاكل شائعة:

- [ ] خطأ 404: تأكد من صحة الـ route
- [ ] خطأ 500: تحقق من الـ logs
- [ ] خطأ CORS: تأكد من إعدادات CORS
- [ ] خطأ قاعدة البيانات: تحقق من الاتصال والـ schema

## 8. معلومات للباك إند ديفيلوبر:

### المطلوب من الباك إند:

1. **حقل PurchaseCount في جدول Products**
2. **API endpoint لزيادة عدد المشتريات**
3. **API endpoint لجلب المنتجات الأكثر طلباً**
4. **إعدادات CORS للفرونت إند**
5. **معالجة الأخطاء بشكل صحيح**

### أمثلة الـ Response المتوقعة:

#### جلب المنتجات الأكثر طلباً:

```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": 100,
    "purchaseCount": 15,
    "categoryId": 1,
    "imageUrl": "url"
  }
]
```

#### زيادة عدد المشتريات:

```json
{
  "id": 1,
  "name": "Product Name",
  "purchaseCount": 16,
  "success": true
}
```
