# n8n Integration Guide - Invoice Status Management

Цей посібник описує як інтегрувати управління статусами інвойсів у n8n через HTTP запити до MCP сервера.

## Налаштування з'єднання

### 1. Додати HTTP Request ноду у n8n

У n8n вибрати **HTTP Request** ноду та налаштувати:

```
URL: http://<mcp-server-host>:8000/
Method: POST
Headers:
  - Content-Type: application/json
Body (JSON):
  {
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "tool_name",
      "arguments": { ...parameters... }
    }
  }
```

## Приклади для кожного статусу

### 1. Отримати список інвойсів зі статусом "sent"

```javascript
// n8n HTTP Request

Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "list_invoices",
    "arguments": {
      "status": "sent",
      "limit": "10",
      "offset": "0"
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "invoices": [
    {
      "_id": "inv_123",
      "invoiceNumber": "INV-001",
      "status": "sent",
      "total": 5000,
      "amountDue": 5000,
      "dueDate": "2024-02-15"
    }
  ],
  "total": 1
}
```

### 2. Отримати статус конкретного інвойса

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "get_invoice",
    "arguments": {
      "invoiceId": "inv_123"
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "_id": "inv_123",
  "invoiceNumber": "INV-001",
  "status": "sent",
  "total": 5000,
  "amountDue": 5000,
  "amountPaid": 0,
  "issueDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-16T15:30:00Z"
}
```

### 3. Створити новий інвойс (Draft)

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "create_invoice",
    "arguments": {
      "contactId": "contact_123",
      "currency": "USD",
      "title": "월급 - January 2024",
      "issueDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "invoiceItems": [
        {
          "name": "Service 1",
          "quantity": 1,
          "price": 5000
        }
      ]
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "_id": "inv_456",
  "invoiceNumber": "INV-002",
  "status": "draft",
  "total": 5000,
  "contactId": "contact_123"
}
```

### 4. Надіслати інвойс (Draft → Sent)

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "send_invoice",
    "arguments": {
      "invoiceId": "inv_456",
      "action": "email",
      "emailTo": "client@example.com",
      "subject": "Invoice INV-002",
      "message": "Please find attached your invoice"
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "_id": "inv_456",
  "invoiceNumber": "INV-002",
  "status": "sent",
  "message": "Invoice sent successfully"
}
```

### 5. Записати платіж (→ Paid)

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "record_invoice_payment",
    "arguments": {
      "invoiceId": "inv_456",
      "paymentData": {
        "amount": 5000,
        "paymentDate": "2024-01-20",
        "paymentMethod": "credit_card",
        "transactionId": "txn_789"
      }
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "_id": "inv_456",
  "status": "paid",
  "amountPaid": 5000,
  "amountDue": 0,
  "message": "Payment recorded successfully"
}
```

### 6. Анулювати інвойс (→ Void)

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "void_invoice",
    "arguments": {
      "invoiceId": "inv_456",
      "voidData": {
        "reason": "Customer requested cancellation",
        "notes": "Full refund to be issued"
      }
    }
  }
}
```

**Очікуваний результат:**
```json
{
  "_id": "inv_456",
  "status": "void",
  "message": "Invoice voided successfully"
}
```

### 7. Оновити деталі інвойса

```javascript
Method: POST
URL: http://mcp-server:8000/

Body:
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "tools/call",
  "params": {
    "name": "update_invoice",
    "arguments": {
      "invoiceId": "inv_456",
      "invoiceData": {
        "title": "Updated Invoice Title",
        "dueDate": "2024-03-15",
        "invoiceItems": [
          {
            "name": "Updated Service",
            "quantity": 2,
            "price": 2500
          }
        ]
      }
    }
  }
}
```

## n8n Workflow Templates

### Workflow 1: Автоматична видача та відправка рахунків

```
[Webhook: New order received]
    ↓
[Function: Format invoice data]
    ↓
[HTTP Request: create_invoice]
    ↓
[HTTP Request: send_invoice]
    ↓
[Function: Extract email]
    ↓
[Send Email: Confirmation]
```

### Workflow 2: Моніторинг прострочених рахунків

```
[Schedule: Daily at 9am]
    ↓
[HTTP Request: list_invoices (status=sent)]
    ↓
[Function: Calculate overdue]
    ↓
[Loop: For each overdue invoice]
    ├→ [HTTP Request: get_invoice]
    └→ [Send Email: Payment reminder]
```

### Workflow 3: Автоматична запис платежу

```
[Webhook: Payment received from payment processor]
    ↓
[Function: Extract payment data]
    ↓
[HTTP Request: record_invoice_payment]
    ↓
[Function: Check if fully paid]
    ├→ [Send Email: Thank you + receipt]
    └→ [Update CRM with payment status]
```

### Workflow 4: Управління статусами у CRM

```
[CRM Webhook: Status change]
    ↓
[Switch: What is new status?]
    ├→ "approved" → [HTTP Request: create_invoice]
    ├→ "sent" → [HTTP Request: send_invoice]
    ├→ "paid" → [HTTP Request: record_invoice_payment]
    └→ "cancelled" → [HTTP Request: void_invoice]
```

## Error Handling у n8n

Додати обробку помилок:

```javascript
// HTTP Request з error handling
{
  "Continue on Fail": true
}

// Потім додати умовну логіку:
IF response.status !== 'success'
  THEN send error notification
```

## n8n JavaScript Function для форматування

```javascript
// Format invoice items for n8n
return {
  contactId: $input.first().json.contactId,
  currency: "USD",
  title: `Invoice for ${$input.first().json.customerName}`,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
  invoiceItems: [
    {
      name: "Service/Product",
      quantity: $input.first().json.quantity,
      price: $input.first().json.amount
    }
  ]
};
```

## Фільтри для list_invoices

У n8n можна фільтрувати інвойси за різними критеріями:

```javascript
// Отримати всі неоплачені рахунки
{
  "status": "sent",
  "limit": "100",
  "offset": "0"
}

// Отримати рахунки за період
{
  "startAt": "2024-01-01",
  "endAt": "2024-01-31",
  "limit": "10",
  "offset": "0"
}

// Отримати рахунки для конкретного контакту
{
  "contactId": "contact_123",
  "limit": "10",
  "offset": "0"
}
```

## Rate Limiting та Best Practices

1. **Пакетна обробка**: Використовувати Loop для обробки кількох рахунків
2. **Кешування**: Зберігати отримані статуси у розпилу для уникнення повторних запитів
3. **Retry Logic**: Додати retry механізм при помилках
4. **Logging**: Зберігати логи всіх операцій для аудиту

## Debugging

Додати блок для вивода деталей відповіді:

```javascript
// n8n Set node для debugging
{
  "response": $response.body,
  "status": $response.status,
  "headers": $response.headers
}
```

## Тестування

Скопіювати curl команду для тестування у терміналі:

```bash
curl -X POST http://mcp-server:8000/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "list_invoices",
      "arguments": {
        "status": "sent",
        "limit": "10",
        "offset": "0"
      }
    }
  }'
```
