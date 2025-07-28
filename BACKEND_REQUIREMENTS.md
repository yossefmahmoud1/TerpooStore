# متطلبات الباك إند - ميزة المنتجات الأكثر طلباً

## الميزة المطلوبة

إضافة ميزة لتتبع عدد مرات الضغط على زر "Buy Now" لكل منتج وعرض المنتجات الأكثر طلباً في الداشبورد.

## التعديلات المطلوبة في الباك إند

### 1. تحديث نموذج المنتج (Product Model)

```csharp
public class Product
{
    // ... الخصائص الموجودة

    // إضافة حقل جديد لتتبع عدد المشتريات
    public int PurchaseCount { get; set; } = 0;
}
```

### 2. إضافة API Endpoint لتحديث عدد المشتريات

```csharp
// في ProductsController
[HttpPost("{id}/increment-purchase")]
public async Task<IActionResult> IncrementPurchaseCount(int id)
{
    try
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return NotFound(new { message = "Product not found" });

        product.PurchaseCount++;
        await _context.SaveChangesAsync();

        return Ok(product);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}
```

### 3. إضافة API Endpoint لجلب المنتجات الأكثر طلباً

```csharp
// في ProductsController
[HttpGet("most-requested")]
public async Task<IActionResult> GetMostRequestedProducts()
{
    try
    {
        var products = await _context.Products
            .Where(p => p.PurchaseCount > 0)
            .OrderByDescending(p => p.PurchaseCount)
            .Take(10)
            .ToListAsync();

        return Ok(products);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}
```

### 4. تحديث قاعدة البيانات

```sql
-- إضافة عمود purchaseCount إلى جدول Products
ALTER TABLE Products ADD PurchaseCount INT DEFAULT 0;
```

### 5. تحديث DTOs (إذا كنت تستخدم DTOs)

```csharp
public class ProductDto
{
    // ... الخصائص الموجودة
    public int PurchaseCount { get; set; }
}
```

## API Endpoints المطلوبة

### 1. تحديث عدد المشتريات

- **Method**: POST
- **URL**: `/api/Products/{id}/increment-purchase`
- **Description**: يزيد عدد المشتريات للمنتج بمقدار 1
- **Response**: المنتج المحدث مع عدد المشتريات الجديد

### 2. جلب المنتجات الأكثر طلباً

- **Method**: GET
- **URL**: `/api/Products/most-requested`
- **Description**: يجلب أعلى 10 منتجات حسب عدد المشتريات
- **Response**: قائمة المنتجات مرتبة تنازلياً حسب عدد المشتريات

## مثال على الاستجابة المتوقعة

### تحديث عدد المشتريات

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 100,
  "purchaseCount": 5
  // ... باقي خصائص المنتج
}
```

### المنتجات الأكثر طلباً

```json
[
  {
    "id": 1,
    "name": "Product 1",
    "price": 100,
    "purchaseCount": 15
    // ... باقي الخصائص
  },
  {
    "id": 2,
    "name": "Product 2",
    "price": 200,
    "purchaseCount": 12
    // ... باقي الخصائص
  }
]
```

## ملاحظات مهمة

1. **الأمان**: تأكد من إضافة authentication/authorization إذا كان مطلوباً
2. **Validation**: تأكد من التحقق من وجود المنتج قبل التحديث
3. **Error Handling**: أضف معالجة مناسبة للأخطاء
4. **Logging**: يمكن إضافة logging لتتبع عمليات تحديث عدد المشتريات
5. **Performance**: يمكن إضافة caching للمنتجات الأكثر طلباً إذا لزم الأمر

## الفرونت إند جاهز

الفرونت إند تم تجهيزه بالكامل ويتضمن:

- ✅ تحديث عدد المشتريات عند الضغط على "Buy Now"
- ✅ تاب جديد في الداشبورد لعرض المنتجات الأكثر طلباً
- ✅ عرض عدد الطلبات في جدول المنتجات العادي
- ✅ ترتيب المنتجات حسب عدد الطلبات
- ✅ تصميم جميل ومتجاوب

بمجرد إضافة هذه التعديلات في الباك إند، ستكون الميزة جاهزة للاستخدام!
