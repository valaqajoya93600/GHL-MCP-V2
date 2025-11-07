# Troubleshooting 403 Forbidden - Invoice Status API

Ви отримуєте помилку `403 Forbidden` при спробі змінити статус інвойса. Це керівництво допоможе вам вирішити цю проблему.

## Виявлена проблема

```
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send...'
{"message":"Forbidden resource","error":"Forbidden","statusCode":403}
```

## Можливі причини та рішення

### 1. ❌ НЕПРАВИЛЬНИЙ API КЛЮЧ

**Проблема**: Використовуєте неправильний API ключ  
**Рішення**:

```bash
# Перевірте, що використовуєте "Private Integrations" API ключ, НЕ "User API Key"
# Private Integrations API ключ повинен починатися з "pit-"

# НЕПРАВИЛЬНО:
Authorization: Bearer YOUR_USER_API_KEY

# ПРАВИЛЬНО:
Authorization: Bearer pit-xxxxxxxxxxxxx

# Як отримати Private Integrations API Key:
# 1. Перейти в GoHighLevel: Settings → Integrations → Private Integrations
# 2. Натиснути "Create Private Integration"
# 3. Скопіювати API Key (повинен починатися з "pit-")
```

### 2. ❌ НЕПРАВИЛЬНА ЛОКАЦІЯ

**Проблема**: `altId` не відповідає локації, де знаходиться інвойс  
**Рішення**:

```bash
# Отримати всі ваші локації
curl -X GET 'https://services.leadconnectorhq.com/locations/' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28"

# У відповіді знайдіть правильну локацію та скопіюйте id
# Потім переконайтесь використовуєте цей id як altId
```

### 3. ❌ НЕДОСТАТНЬО ДОЗВОЛІВ

**Проблема**: API ключ або користувач не має дозволу на керування інвойсами  
**Рішення**:

```bash
# Перевірити дозволи приватної інтеграції:
# 1. Перейти Settings → Integrations → Private Integrations
# 2. Натиснути на вашу інтеграцію
# 3. Перевірити що в розділі "Scopes" або "Permissions" включено:
#    - Invoices (Read/Write)
#    - Contacts (Read/Write)

# Якщо дозволи відсутні:
# 1. Видалити поточну інтеграцію
# 2. Створити нову з потрібними дозволами
```

### 4. ❌ НЕПРАВИЛЬНИЙ ID ІНВОЙСА

**Проблема**: Інвойс з таким ID не існує або надходить від іншої локації  
**Рішення**:

```bash
# Спочатку отримайте список інвойсів для перевірки
curl -X GET 'https://services.leadconnectorhq.com/invoices/?altId=YOUR_LOCATION_ID&altType=location&limit=10' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28"

# Переконайтесь що інвойс з ID 690db165294c45e833a49810 існує у цій локації
# Скопіюйте правильний ID з результатів
```

### 5. ❌ НЕПРАВИЛЬНА ВЕРСІЯ API

**Проблема**: Заголовок `Version` неправильний або відсутній  
**Рішення**:

```bash
# ПРАВИЛЬНО:
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -d '{"action": "email"}'

# ВАЖНО: Деякі ендпоінти GoHighLevel вимагають altId та altType у заголовках, не у query параметрах!
```

### 6. ❌ НЕПРАВИЛЬНИЙ МЕТОД ЗАПИТУ

**Проблема**: Використовуєте неправильний HTTP метод  
**Рішення**:

```bash
# Для відправки інвойса - використовуйте POST
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send' ...

# Для отримання інвойса - використовуйте GET
curl -X GET 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810' ...

# Для оновлення інвойса - використовуйте PUT
curl -X PUT 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810' ...
```

## Пошаговий Дебаг

### Крок 1: Перевірити API ключ

```bash
# Це повинно повернути інформацію про вашу локацію
curl -X GET 'https://services.leadconnectorhq.com/locations/' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json"

# Якщо отримуєте 401 Unauthorized - API ключ неправильний
# Якщо отримуєте 403 Forbidden - дозволи недостатньо
# Якщо отримуєте 200 OK - ключ правильний
```

### Крок 2: Отримати правильний ID локації

```bash
# З попередньої команди копіюйте поле "id" з однієї локацій
# Або якщо у вас один аккаунт:

curl -X GET 'https://services.leadconnectorhq.com/locations/' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" | jq '.locations[0].id'

# Збережіть цей ID як YOUR_LOCATION_ID
```

### Крок 3: Перевірити дозволи для інвойсів

```bash
# Отримайте список інвойсів - це перевіримає дозволи
curl -X GET 'https://services.leadconnectorhq.com/invoices/' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -H "Content-Type: application/json"

# Якщо отримуєте 403 - дозволи не включені для інвойсів
# Якщо отримуєте 200 - дозволи є
```

### Крок 4: Перевірити конкретний інвойс

```bash
# Отримайте деталі інвойса
curl -X GET 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -H "Content-Type: application/json"

# Якщо отримуєте 404 - інвойс не знайдено
# Якщо отримуєте 403 - дозволи недостатньо
# Якщо отримуєте 200 - інвойс знайдено
```

### Крок 5: Спробуйте змінити статус

```bash
# Спробуйте відправити інвойс
curl -X POST 'https://services.leadconnectorhq.com/invoices/690db165294c45e833a49810/send' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "email",
    "userId": "user_id_if_needed"
  }'

# Перевірити відповідь
```

## Правильний формат запиту

### Для отправки інвойса (Draft → Sent):

```bash
curl -X POST 'https://services.leadconnectorhq.com/invoices/{invoiceId}/send' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -d '{
    "action": "email",
    "emailTo": "client@example.com",
    "subject": "Invoice",
    "message": "Please find your invoice attached"
  }'
```

### Для запису платежу (→ Paid):

```bash
curl -X POST 'https://services.leadconnectorhq.com/invoices/{invoiceId}/record-payment' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -d '{
    "amount": 1000,
    "paymentDate": "2024-01-20",
    "paymentMethod": "credit_card",
    "transactionId": "txn_123"
  }'
```

### Для анулювання інвойса (→ Void):

```bash
curl -X POST 'https://services.leadconnectorhq.com/invoices/{invoiceId}/void' \
  -H "Authorization: Bearer pit-YOUR_API_KEY" \
  -H "Version: 2021-07-28" \
  -H "Content-Type: application/json" \
  -H "altId: YOUR_LOCATION_ID" \
  -H "altType: location" \
  -d '{
    "reason": "Customer requested cancellation"
  }'
```

## Перевірка через MCP сервер (рекомендується)

Замість прямого API виклику, використовуйте MCP сервер який вже налаштований:

### Запуск MCP сервера

```bash
# 1. Встановити залежності
npm install

# 2. Налаштувати .env файл
cp .env.example .env
# Відредагувати .env і додати:
# GHL_API_KEY=pit-YOUR_API_KEY
# GHL_LOCATION_ID=YOUR_LOCATION_ID
# GHL_BASE_URL=https://services.leadconnectorhq.com

# 3. Запустити сервер
npm start

# або для HTTP сервера (для n8n):
npm run dev:http
```

### Перевіння через curl з MCP сервера

```bash
# HTTP вже отримано інвойси
curl -X GET 'http://localhost:8000/api/invoices/status-info'

# Змінити статус через новий HTTP ендпоінт
curl -X POST 'http://localhost:8000/api/invoices/change-status' \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "690db165294c45e833a49810",
    "targetStatus": "sent",
    "action": "email",
    "emailTo": "client@example.com"
  }'
```

## Типові помилки та рішення

| Помилка | Причина | Рішення |
|---------|---------|---------|
| 401 Unauthorized | Неправильний API ключ | Перевірити API ключ у Settings → Private Integrations |
| 403 Forbidden | Недостатньо дозволів | Переконатися що дозволи "Invoices" включені |
| 404 Not Found | Інвойс не знайдено | Перевірити ID інвойса та локацію |
| 400 Bad Request | Неправильні параметри | Перевірити формат запиту та обов'язкові поля |
| 422 Unprocessable Entity | Неправильний статус переходу | Перевірити чи можна перейти в цей статус |

## Контакт та підтримка

Якщо проблема не вирішена:

1. **Перевірте логи MCP сервера**: Запустіть сервер з debug логами
   ```bash
   DEBUG=* npm start
   ```

2. **Контактуйте GoHighLevel Support**: support@gohighlevel.com

3. **Перевірите документацію GoHighLevel**: https://developer.gohighlevel.com/
