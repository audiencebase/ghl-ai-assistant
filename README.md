# GHL AI Assistant

AI-powered assistant for GoHighLevel using Google Gemini - deployable to Vercel in 5 minutes!

## 🚀 Quick Deploy to Vercel

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Repository name: `ghl-ai-assistant`
3. Make it Public
4. Click "Create repository"

### Step 2: Upload Files
1. Click "uploading an existing file"
2. Drag and drop ALL files from this folder
3. Commit message: "Initial setup"
4. Click "Commit changes"

### Step 3: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your `ghl-ai-assistant` repository
4. Click "Deploy"

### Step 4: Add Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
GHL_API_KEY=your_ghl_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API keys:**
- GHL API Key: GHL Settings → Integrations → API Keys
- Gemini API Key: [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 5: Add to GHL Custom Menu
1. GHL → Settings → White Label → Custom Menu Items
2. Click "Add Custom Menu Item"
3. **Name:** AI Assistant
4. **URL:** `https://your-vercel-app.vercel.app?locationId={{location.id}}&userId={{user.id}}`
5. **Icon:** 🤖
6. Save

## 🎯 What It Does

Your AI assistant can:
- ✅ View all contacts
- ✅ Create/update contacts  
- ✅ Manage opportunities
- ✅ Send messages
- ✅ View conversations
- ✅ Access all GHL data

## 💡 Usage Examples

**"Show me my recent contacts"**
**"Create a contact for John Doe with email john@example.com"**
**"What opportunities are in my pipeline?"**
**"Send a follow-up message to contact ID 123"**

## 🔧 Troubleshooting

**Chat not loading?**
- Check environment variables are set
- Verify API keys are correct

**"Authentication Failed"?**
- Double-check your GHL API key
- Make sure it has proper permissions

**"Location not found"?**
- Verify the custom menu URL includes `{{location.id}}`

## 🆘 Need Help?

Open an issue on GitHub or contact support.

---

**Total setup time: 5 minutes** ⚡