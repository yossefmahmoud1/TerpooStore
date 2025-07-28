# API Integration Documentation

## Overview

This document describes the API integration setup for the TerpooStore application, which connects to your backend API at `http://terpoostore.runasp.net`.

## Architecture

### 1. Service Layer (`src/services/`)

- **`api.js`**: Base axios configuration with interceptors
- **`productService.js`**: Product-related API endpoints
- **`authService.js`**: Authentication-related API endpoints

### 2. React Query Hooks (`src/hooks/`)

- **`useProducts.js`**: Product data fetching and mutations
- **`useAuth.js`**: Authentication state management

### 3. Configuration (`src/config/`)

- **`environment.js`**: Environment variables and app configuration

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/bestsellers` - Get best selling products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?q={query}` - Search products
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/{id}` - Update product (admin only)
- `DELETE /api/products/{id}` - Delete product (admin only)
- `POST /api/products/upload-images` - Upload product images

### Authentication

- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

## Usage Examples

### Fetching Products

```javascript
import { useProducts, useBestSellers } from "../hooks/useProducts";

// Get all products
const { data: products, isLoading, error } = useProducts();

// Get best sellers
const { data: bestSellers } = useBestSellers();
```

### Creating a Product (Admin)

```javascript
import { useCreateProduct } from "../hooks/useProducts";

const createProductMutation = useCreateProduct();

const handleCreate = (productData) => {
  createProductMutation.mutate(productData);
};
```

### Authentication

```javascript
import { useAdminLogin, useAdminLogout } from "../hooks/useAuth";

const loginMutation = useAdminLogin();
const logoutMutation = useAdminLogout();

// Login
loginMutation.mutate({ username: "admin", password: "password" });

// Logout
logoutMutation.mutate();
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://terpoostore.runasp.net/api
```

## Error Handling

The application includes comprehensive error handling:

1. **Network Errors**: Automatic retry with exponential backoff
2. **Authentication Errors**: Automatic logout and redirect
3. **Validation Errors**: User-friendly error messages
4. **Loading States**: Loading spinners and skeleton screens

## Caching Strategy

React Query provides intelligent caching:

- **Stale Time**: 5 minutes for most data
- **Garbage Collection**: 10 minutes for unused data
- **Background Refetching**: Automatic updates when window regains focus
- **Optimistic Updates**: Immediate UI updates for mutations

## Security Features

1. **Token Management**: Automatic token storage and refresh
2. **Request Interceptors**: Automatic token injection
3. **Response Interceptors**: Automatic error handling
4. **Secure Storage**: Tokens stored in localStorage with proper cleanup

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Ensure your API is running at `http://terpoostore.runasp.net`

## API Response Format

### Success Response

```json
{
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description",
    "images": ["url1", "url2"],
    "category": "Elite",
    "isBestSeller": true
  }
}
```

### Error Response

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API allows requests from `http://localhost:5173`
2. **Network Errors**: Check if your API is running and accessible
3. **API Endpoint**: Verify the API is accessible at `http://terpoostore.runasp.net/api`

### Debug Mode

Enable debug logging by setting:

```javascript
// In src/services/api.js
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add this for debugging
api.interceptors.request.use((request) => {
  console.log("Request:", request);
  return request;
});

api.interceptors.response.use((response) => {
  console.log("Response:", response);
  return response;
});
```

## Performance Optimization

1. **Query Deduplication**: Multiple components requesting the same data share the same request
2. **Background Updates**: Data is refreshed in the background
3. **Pagination**: Large datasets are paginated automatically
4. **Debounced Search**: Search requests are debounced to reduce API calls

## Testing

The API integration can be tested using:

1. **React Query DevTools**: Available in development mode
2. **Network Tab**: Monitor API requests in browser dev tools
3. **Console Logs**: Debug information is logged to console

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Offline Support**: Service worker for offline functionality
3. **Advanced Caching**: Redis-like caching strategy
4. **API Versioning**: Support for multiple API versions
