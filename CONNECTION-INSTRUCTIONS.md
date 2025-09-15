# 🔌 GoHighLevel MCP Server Connection Guide

Welcome to your comprehensive guide for connecting the GoHighLevel MCP Server to various AI platforms. This server provides 269+ tools across 19+ functional categories for complete GoHighLevel CRM automation.

## 🚀 Quick Deployment (Recommended: Vercel)

**Why Vercel?** ✅ Best SSE support ✅ Global edge network ✅ Zero configuration ✅ Cost-effective

### Deploy to Vercel (30 seconds):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (one command!)
vercel --prod

# Set environment variables in Vercel dashboard
```

**Required Environment Variables:**
```
GHL_API_KEY=your_ghl_private_integration_key
GHL_BASE_URL=https://services.leadconnectorhq.com
GHL_LOCATION_ID=your_location_id
```

---

## 🔄 Two Connection Types: STDIO vs HTTP/SSE

### **STDIO Transport** 📱
- **Use for**: Claude Desktop (local installation)
- **Protocol**: Standard input/output streams
- **Connection**: Direct process communication
- **Performance**: Fastest, no network overhead

### **HTTP/SSE Transport** 🌐  
- **Use for**: ChatGPT, web applications, remote connections
- **Protocol**: HTTP with Server-Sent Events
- **Connection**: RESTful API with real-time streaming
- **Performance**: Network-dependent, globally optimized

---

## 📱 Platform-Specific Connection Instructions

### **1. Claude Desktop** (STDIO Mode)

**Requirements:**
- Claude Desktop application installed
- Node.js 18+ installed locally
- Built project (`npm run build`)

**Setup:**
1. **Build the project:**
   ```bash
   npm install
   npm run build
   ```

2. **Configure Claude Desktop:**
   Open/create: `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
   
   ```json
   {
     "mcpServers": {
       "ghl-mcp-server": {
         "command": "node",
         "args": ["C:\\path\\to\\your\\project\\dist\\server.js"],
         "env": {
           "GHL_API_KEY": "your_ghl_private_integration_key",
           "GHL_BASE_URL": "https://services.leadconnectorhq.com",
           "GHL_LOCATION_ID": "your_location_id"
         }
       }
     }
   }
   ```

3. **Restart Claude Desktop**
4. **Verify connection:** Look for "🔧 269+ tools available" in Claude

**Transport Used:** STDIO (Standard Input/Output)
**Connection Method:** Direct process spawning
**Best For:** Local development, maximum performance, desktop workflows

---

### **2. ChatGPT** (HTTP/SSE Mode)

**Requirements:**
- Deployed MCP server (Vercel recommended)
- ChatGPT Plus/Pro subscription
- Public HTTPS endpoint

**Setup:**
1. **Deploy to Vercel** (see Quick Deployment above)

2. **Get your deployment URL:**
   ```
   https://your-project-name.vercel.app
   ```

3. **Configure ChatGPT:**
   - Go to **Settings** → **Beta Features** → **Model Context Protocol**
   - Click **Add Server**
   - **Server URL:** `https://your-project-name.vercel.app/sse`
   - **API Key:** Leave blank (using environment variables)

4. **Test connection:**
   ```
   Ask ChatGPT: "What GoHighLevel tools are available?"
   ```

**Transport Used:** HTTP with Server-Sent Events (SSE)
**Connection Method:** RESTful API with real-time streaming
**Best For:** Web access, collaboration, cloud-based workflows

---

### **3. Custom Applications** (HTTP/SSE Mode)

**Requirements:**
- Your deployed MCP server endpoint
- HTTP client with SSE support
- MCP protocol implementation

**Connection Pattern:**
```javascript
// Connect to SSE endpoint
const eventSource = new EventSource('https://your-deployment.vercel.app/sse');

// Send JSON-RPC requests via POST
fetch('https://your-deployment.vercel.app/sse', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  })
});
```

**Transport Used:** HTTP/SSE
**Connection Method:** Standard MCP over HTTP
**Best For:** Custom integrations, mobile apps, third-party platforms

---

## 🛠️ Environment Variables Guide

### **GoHighLevel API Configuration:**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GHL_API_KEY` | ✅ Yes | Private Integration API Key | `ghl_abc123...` |
| `GHL_BASE_URL` | ✅ Yes | GoHighLevel API Base URL | `https://services.leadconnectorhq.com` |
| `GHL_LOCATION_ID` | ✅ Yes | Your Location/Sub-Account ID | `abc123def456` |

### **How to Get These Values:**

#### **GHL_API_KEY** (Private Integration Key):
1. Go to **GoHighLevel** → **Settings** → **Integrations**
2. Click **Private Integrations** → **Create Integration**
3. Set required scopes (contacts.write, conversations.readonly, etc.)
4. Copy the generated **API Key**

#### **GHL_LOCATION_ID**:
1. Go to **Settings** → **Company** → **Locations**
2. Copy the **Location ID** from your desired sub-account
3. For agency accounts, select the specific location you want to manage

#### **GHL_BASE_URL**:
- Always use: `https://services.leadconnectorhq.com`
- This is GoHighLevel's standard API endpoint

---

## 🔧 Available Tools by Category

Your MCP server provides **269+ tools** across these categories:

| Category | Tools | Key Features |
|----------|-------|--------------|
| **Contact Management** | 31 | Create, update, search, tag, bulk operations |
| **Calendar & Appointments** | 39 | Booking, scheduling, availability, time blocking |
| **Conversations & Messaging** | 20 | SMS, email, call recordings, live chat |
| **Location Management** | 24 | Sub-accounts, custom fields, templates |
| **Payments & E-commerce** | 38 | Transactions, store, invoices, subscriptions |
| **Social Media** | 17 | Multi-platform posting, scheduling |
| **Opportunity Management** | 10 | Sales pipeline, stages, win/loss tracking |
| **Blog Management** | 7 | Content creation, SEO optimization |
| **Marketing Automation** | 5 | Email campaigns, sequences |
| **Custom Objects & Fields** | 17 | Schema management, custom data |
| **Media & Assets** | 3 | File uploads, hosted URLs |
| **Surveys & Forms** | 2 | Response collection, analysis |
| **Workflow Discovery** | 1 | Automation insights |

---

## 🧪 Testing Your Connection

### **Quick Health Check:**
```bash
# Test your deployed endpoint
curl https://your-deployment.vercel.app/health

# Should return:
{
  "status": "healthy",
  "server": "ghl-mcp-server",
  "version": "1.0.0",
  "protocol": "2024-11-05",
  "tools": ["search", "retrieve", "...269+ tools"],
  "endpoint": "/sse"
}
```

### **MCP Protocol Test:**
```bash
# Test MCP initialization
curl -X POST https://your-deployment.vercel.app/sse \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'
```

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **"Connection Failed" in Claude Desktop:**
- ✅ Check file path in `claude_desktop_config.json`
- ✅ Verify `npm run build` was executed
- ✅ Ensure Node.js 18+ is installed
- ✅ Check environment variables in config
- ✅ Restart Claude Desktop after config changes

#### **"Server Unavailable" in ChatGPT:**
- ✅ Verify deployment is live (`/health` endpoint)
- ✅ Check environment variables in Vercel dashboard
- ✅ Ensure SSE endpoint returns proper headers
- ✅ Test with curl first before ChatGPT

#### **"Invalid API Key" Errors:**
- ✅ Use **Private Integration** API key (not regular API key)
- ✅ Verify key has required scopes
- ✅ Check `GHL_LOCATION_ID` matches your sub-account
- ✅ Ensure key isn't expired or revoked

#### **"Tools Not Loading":**
- ✅ Verify all environment variables are set
- ✅ Check server logs for API errors
- ✅ Test GoHighLevel API access directly
- ✅ Ensure location ID has proper permissions

---

## 🔄 Connection Type Decision Matrix

| Use Case | Platform | Transport | Setup Complexity | Performance | Best For |
|----------|----------|-----------|------------------|-------------|----------|
| **Local Development** | Claude Desktop | STDIO | Medium | Fastest | Development, testing |
| **Personal Use** | Claude Desktop | STDIO | Medium | Fastest | Daily workflows |
| **Team Collaboration** | ChatGPT | HTTP/SSE | Easy | Fast | Shared access |
| **Web Integration** | Custom App | HTTP/SSE | Hard | Good | Custom solutions |
| **Mobile Access** | ChatGPT | HTTP/SSE | Easy | Good | On-the-go management |
| **Production Automation** | Both | Both | Medium | Varies | Enterprise workflows |

---

## 🎯 Next Steps

1. **Choose your platform** (Claude Desktop or ChatGPT)
2. **Deploy to Vercel** (recommended) or run locally
3. **Set environment variables** with your GoHighLevel credentials
4. **Test the connection** using provided examples
5. **Start automating** your GoHighLevel workflows!

**Need help?** Check the troubleshooting section above or test individual endpoints with curl.

---

## 📚 Additional Resources

- **MCP Protocol Specification:** [MCP 2024-11-05](https://spec.modelcontextprotocol.io/)
- **GoHighLevel API Docs:** [GoHighLevel API Reference](https://highlevel.stoplight.io/)
- **Vercel Deployment Guide:** [Vercel Documentation](https://vercel.com/docs)
- **Claude Desktop MCP:** [Claude MCP Documentation](https://docs.anthropic.com/claude/mcp)

**Happy automating with GoHighLevel + AI!** 🚀