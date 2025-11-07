# Invoice Status Management for n8n

Це документація описує як керувати статусами рахунків (інвойсів) у n8n через MCP сервер GoHighLevel.

## Доступні статуси інвойсів

В системі GoHighLevel існує 7 можливих статусів рахунків:

### 1. **Draft (Чернетка)** - `draft`
- **Опис**: Рахунок створено, але ще не надіслано клієнту
- **Як створити**: Використати инструмент `create_invoice`
- **Редагування**: На цьому етапі можна вільно редагувати всі деталі рахунку через `update_invoice`
- **MCP Інструмент**: `create_invoice`, `update_invoice`

### 2. **Sent (Надіслано)** - `sent`
- **Опис**: Рахунок успішно доставлено клієнту
- **Як змінити статус**: Використати інструмент `send_invoice`
- **Параметри**: 
  - `invoiceId`: ID рахунку
  - `action`: способ доставки (`email`, `sms`, `sms_and_email`, `send_manually`)
- **MCP Інструмент**: `send_invoice`

### 3. **Due in X days (До сплати через X днів)**
- **Опис**: Рахунок надіслано, але ще не прострочений
- **Це не явний статус** - визначається автоматично на основі дати сплати (`dueDate`)
- **Як перевірити**: Отримати рахунок через `get_invoice` та порівняти `dueDate` з поточною датою
- **MCP Інструмент**: `get_invoice`, `list_invoices` (з фільтром `status`)

### 4. **Overdue (Прострочено)**
- **Опис**: Рахунок надіслано, але оплата не надійшла вчасно
- **Це не явний статус** - визначається автоматично коли дата сплати перевищена
- **Як перевірити**: Отримати рахунок та порівняти `dueDate` з поточною датою
- **MCP Інструмент**: `list_invoices` (з фільтром `status`)

### 5. **Paid (Оплачено)** - `paid`
- **Опис**: Клієнт повністю оплатив рахунок
- **Як змінити статус**: Записати платіж через `record_invoice_payment`
- **Параметри**:
  - `invoiceId`: ID рахунку
  - `paymentData`: об'єкт з деталями платежу (сума, дата, метод)
- **MCP Інструмент**: `record_invoice_payment`

### 6. **Not Sent (Не надіслано)**
- **Опис**: Доставка рахунку не вдалася через системну помилку
- **Як вирішити**: Повторно надіслати через `send_invoice`
- **MCP Інструмент**: `send_invoice`

### 7. **Void (Анульовано)** - `void`
- **Опис**: Рахунок скасовано
- **Обмеження**: Можна анулювати лише рахунки, які ще не оплачені, або після повернення коштів
- **Як змінити статус**: Використати інструмент `void_invoice`
- **Параметри**:
  - `invoiceId`: ID рахунку
  - `voidData`: причина анулювання та інші деталі
- **MCP Інструмент**: `void_invoice`

## Типовий цикл змін статусу

```
Draft → (редагування) → Draft → (надіслати) → Sent → (сплатити або прострочити)
  ↓                                              ↓
  └──────────────────→ Void                      ├─→ Paid (оплачено)
  (анулювання)                                   ├─→ Overdue (прострочено)
                                                 └─→ Not Sent (помилка доставки)
                                                     ↓
                                                     (повторна відправка)
                                                     ↓
                                                     Sent
```

## n8n Integration - Доступні інструменти

### Інструменти для керування статусами:

#### 1. `list_invoices` - Отримати список інвойсів
```json
{
  "tool": "list_invoices",
  "params": {
    "status": "sent",
    "limit": "10",
    "offset": "0"
  }
}
```

#### 2. `get_invoice` - Отримати деталі конкретного інвойса
```json
{
  "tool": "get_invoice",
  "params": {
    "invoiceId": "invoice_id_here"
  }
}
```

#### 3. `create_invoice` - Створити новий інвойс (Draft)
```json
{
  "tool": "create_invoice",
  "params": {
    "contactId": "contact_id",
    "currency": "USD",
    "invoiceItems": [...],
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15"
  }
}
```

#### 4. `send_invoice` - Надіслати інвойс (Draft → Sent)
```json
{
  "tool": "send_invoice",
  "params": {
    "invoiceId": "invoice_id",
    "action": "email",
    "emailTo": "client@example.com"
  }
}
```

#### 5. `record_invoice_payment` - Записати платіж (→ Paid)
```json
{
  "tool": "record_invoice_payment",
  "params": {
    "invoiceId": "invoice_id",
    "paymentData": {
      "amount": 1000,
      "paymentDate": "2024-01-20",
      "paymentMethod": "credit_card"
    }
  }
}
```

#### 6. `void_invoice` - Анулювати інвойс (→ Void)
```json
{
  "tool": "void_invoice",
  "params": {
    "invoiceId": "invoice_id",
    "voidData": {
      "reason": "Customer requested cancellation"
    }
  }
}
```

#### 7. `update_invoice` - Оновити деталі інвойса
```json
{
  "tool": "update_invoice",
  "params": {
    "invoiceId": "invoice_id",
    "invoiceData": {
      "title": "Updated Invoice Title",
      "dueDate": "2024-03-01"
    }
  }
}
```

## n8n Workflow Examples

### Приклад 1: Автоматична відправка рахунків при створенні
```
1. Webhook (nuovo invoice created)
   ↓
2. Create Invoice tool
   ↓
3. Send Invoice tool (action: "email")
   ↓
4. Send notification
```

### Приклад 2: Моніторинг прострочених рахунків
```
1. Schedule (daily at 9am)
   ↓
2. List Invoices (status: "sent" або "overdue")
   ↓
3. Filter for overdue
   ↓
4. Loop: Send reminder email
```

### Приклад 3: Запис платежу при webhook від платіжної системи
```
1. Webhook (payment received)
   ↓
2. Record Invoice Payment
   ↓
3. Send confirmation email
```

## API Response Structure

Кожен інвойс містить наступні поля статусу:

```json
{
  "_id": "invoice_123",
  "status": "sent",
  "invoiceNumber": "INV-001",
  "contactDetails": { ... },
  "total": 1000,
  "amountPaid": 0,
  "amountDue": 1000,
  "issueDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-16T15:30:00Z"
}
```

## Статус значення в API

```
'draft' | 'sent' | 'payment_processing' | 'paid' | 'void' | 'partially_paid'
```

## Важні зауваження

1. **Draft статус** - може бути тільки у новоствореного рахунку
2. **Sent статус** - отримується після успішної відправки
3. **Void статус** - можливий тільки для непоплачених рахунків
4. **Автоматичні переходи** - Overdue та Due in X days розраховуються автоматично на основі дати дедлайну
5. **Платіжні статуси** - `paid` та `partially_paid` залежать від записаних платежів
6. **payment_processing** - тимчасовий статус під час обробки платежу

## Перевірка статусу через фільтри

При виклику `list_invoices` можна фільтрувати по статусу:

```
GET /invoices/?status=sent&limit=10&offset=0
GET /invoices/?status=paid&limit=10&offset=0
GET /invoices/?status=draft&limit=10&offset=0
```
