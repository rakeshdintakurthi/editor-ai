# Supabase Setup Guide

## Current Status
⚠️ Your app is running with an **in-memory mock** because Supabase environment variables are not configured.

**This means:**
- ✅ App works fine for testing
- ❌ Data is NOT persisted (lost on refresh)
- ❌ No real database storage

---

## Option 1: Continue with Mock (Quick)
If you just want to test the app without setting up a database, you can ignore the warning. Everything will work, but data won't persist.

---

## Option 2: Set Up Real Supabase (Recommended for Production)

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `ai-code-editor` (or any name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you
5. Click **"Create new project"** and wait ~2 minutes for provisioning

### Step 2: Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 3: Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/20251017135523_create_ai_code_editor_schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** to create all tables

### Step 4: Create .env File
1. In your project root, create a file named `.env` (note the dot at the start)
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTU4NzI4MCwiZXhwIjoxOTU1MTYzMjgwfQ.example_signature_here
```

### Step 5: Restart Your Dev Server
1. Stop your current dev server (Ctrl+C)
2. Run: `npm run dev`
3. The warning should be gone!

---

## Verify Setup
After setting up, you should see:
- ✅ No warning in console about missing env vars
- ✅ Data persists after page refresh
- ✅ Dashboard shows real metrics

---

## Troubleshooting

### Warning still appears
- Make sure `.env` file is in the project root (same folder as `package.json`)
- Restart your dev server completely
- Check that variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Database errors
- Verify you ran the migration SQL in Supabase
- Check that RLS policies are created
- Ensure your anon key has correct permissions

### Need help?
Check the Supabase documentation: https://supabase.com/docs
