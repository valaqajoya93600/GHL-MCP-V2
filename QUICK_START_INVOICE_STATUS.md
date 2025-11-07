# Quick Start - Invoice Status Management

## У вас виникла помилка 403 Forbidden. Вот що зробити:

### Крок 1: Встановіть правильний API ключ ✓

Ви використовуєте:
```
Authorization: Bearer pit-e52e36db-72c6-469d-b895-5cf55c25d5d4
```

**Перевірте**:
- ✓ Ключ повинен починатися з `pit-` (Private Integrations Token)
- ✓ Ключ скопіяний з **Settings → Integrations → Private Integrations**
- ✓ Ключ не є простим User API Key (без приставки `pit-`)

### Крок 2: Перевірте дозволи в приватній інтеграції

1. Перейдіть у **GoHighLevel → Settings**
2. Виберіть **Integrations → Private Integrations**
3. Знайдіть вашу інтеграцію
4. Відкрийте деталі та перевірте що включено:
   - ☑️ **Invoices** (Read/Write)
   - ☑️ **Contacts** (Read/Write) 
   - ☑️ **Locations** (Read/Write)

**Якщо дозволи не включені**:
- Видаліть поточну інтеграцію
- Створіть нову з потрібними дозволами

### Крок 3: Перевірте правильність вашого запиту

**Ваш поточний запит**:
```bash
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send?altId=Yw5AVHYjRDNkmHxR2Wnn&altType=location' \
  -H "Authorization: Bearer pit-e52e36db-72c6-469d-b895-5cf55c25d5d4" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -d '{"action": "email", "emailTo": "test@example.com"}'
```

**ВАЖНО**: Спробуйте передати `altId` та `altType` у **заголовках**, не у URL:

```bash
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send' \
  -H "Authorization: Bearer pit-e52e36db-72c6-469d-b895-5cf55c25d5d4" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -H "altId: Yw5AVHYjRDNkmHxR2Wnn" \
  -H "altType: location" \
  -d '{
    "action": "email",
    "emailTo": "test@example.com",
    "subject": "Your Invoice",
    "message": "Please find your invoice attached"
  }'
```

### Крок 4: Протестуйте вашу конфігурацію

Використовуйте наш скрипт для дебагування:

```bash
# 1. Встановіть залежності (якщо ще не встановлені)
npm install

# 2. Налаштуйте .env файл
cp .env.example .env
# Вставте ваші значення:
# GHL_API_KEY=pit-YOUR_KEY
# GHL_LOCATION_ID=YOUR_LOCATION_ID

# 3. Запустіть тестовий скрипт
bash scripts/test-invoice-api.sh
```

Скрипт перевіримо:
- ✓ Чи правильний ваш API ключ
- ✓ Чи вдалось отримати доступ до інвойсів
- ✓ Чи можна змінити статус інвойса
- ✓ Виведе детальну інформацію про помилку

### Крок 5: Використовуйте MCP сервер (рекомендується)

Замість прямих curl команд, запустіть наш MCP сервер:

```bash
# 1. Запустити сервер (stdio mode)
npm start

# Або для n8n інтеграції (HTTP mode)
npm run dev:http
```

Тоді можете звертатись до інвойсів через новий API:

```bash
# Отримати інформацію про статуси
curl http://localhost:8000/api/invoices/status-info

# Змінити статус інвойса
curl -X POST http://localhost:8000/api/invoices/change-status \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "690db165294c45e833a49810",
    "targetStatus": "sent",
    "action": "email",
    "emailTo": "test@example.com"
  }'
```

## Типовий цикл змін статусів

```
┌─────────────────────────────────────────────────────────────┐
│                    Invoice Status Flow                       │
└─────────────────────────────────────────────────────────────┘

1. CREATE INVOICE
   └─→ Status: draft
   └─→ Tool: create_invoice
   └─→ Можна редагувати та оновлювати

2. SEND INVOICE
   └─→ Status: sent
   └─→ Tool: send_invoice
   └─→ Клієнт отримує рахунок

3. RECORD PAYMENT (одне з нижче)
   ├─→ Status: paid (повна оплата)
   ├─→ Status: partially_paid (часткова оплата)
   └─→ Tool: record_invoice_payment

4. VOID INVOICE (опціонально)
   └─→ Status: void
   └─→ Tool: void_invoice
   └─→ Тільки для непоплачених рахунків

┌──────────────────────────────────────────┐
│ Автоматичні статуси (обраховуються):     │
├──────────────────────────────────────────┤
│ • "Due in X days" - коли deadline близко │
│ • "Overdue" - коли дедлайн пройшов      │
└──────────────────────────────────────────┘
```

## Приклади для n8n

### Приклад 1: Отримати список рахунків

```json
{
  "tool": "list_invoices",
  "arguments": {
    "status": "draft",
    "limit": "10",
    "offset": "0"
  }
}
```

### Приклад 2: Змінити статус рахунку

```json
{
  "tool": "send_invoice",
  "arguments": {
    "invoiceId": "690db165294c45e833a49810",
    "action": "email",
    "emailTo": "client@example.com",
    "subject": "Your Invoice",
    "message": "Please review"
  }
}
```

### Приклад 3: Записати платіж

```json
{
  "tool": "record_invoice_payment",
  "arguments": {
    "invoiceId": "690db165294c45e833a49810",
    "paymentData": {
      "amount": 5000,
      "paymentDate": "2024-01-20",
      "paymentMethod": "credit_card"
    }
  }
}
```

## Якщо проблема не вирішена

### Варіант A: Запустіть тестовий скрипт для детальної діагностики

```bash
bash scripts/test-invoice-api.sh
```

Він покаже:
- Статус підключення до API
- Дозволи вашої інтеграції
- Список ваших інвойсів
- Чому не вдається змінити статус

### Варіант B: Включіть debug логування

```bash
# Запустіть сервер з логуванням
DEBUG=* npm start
```

Дивіться консоль для детальної інформації про запити до API

### Варіант C: Перевірте документацію GoHighLevel

- Official API docs: https://developer.gohighlevel.com/
- Invoice API: https://developer.gohighlevel.com/docs/invoices
- Contact GoHighLevel Support: support@gohighlevel.com

## Вебгук для автоматизації

Якщо хочете автоматизувати зміни статусів через n8n:

```json
{
  "method": "POST",
  "url": "http://localhost:8000/api/invoices/change-status",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "invoiceId": "{{ $json.invoiceId }}",
    "targetStatus": "{{ $json.desiredStatus }}",
    "action": "email",
    "emailTo": "{{ $json.clientEmail }}"
  }
}
```

---

**Потрібна допомога?**
1. Прочитайте TROUBLESHOOTING_403_FORBIDDEN.md
2. Запустіть test-invoice-api.sh
3. Перевірте логи сервера з DEBUG=*
