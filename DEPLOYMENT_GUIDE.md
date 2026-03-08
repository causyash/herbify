# Herbify Deployment Guide

This guide provides step-by-step instructions to deploy your **Backend on Render** and your **Frontend on Netlify**. It also includes a crucial strategy to **stop Netlify from wasting your build credits** on every single commit.

---

## 1. The Netlify "Credit Bypass" Strategy (Stop Wasting Build Minutes)

Since your project contains both a `client` (frontend) and `server` (backend) folder in the same repository, Netlify will normally try to rebuild your frontend every time you make a change to your backend. This rapidly drains your free Netlify build limits!

To bypass this and only trigger builds when absolutely necessary, we will set up an **Ignore Build Command**. 

### How to configure this:
1. Go to your **Netlify Dashboard** -> **Site configuration** -> **Build & deploy** -> **Continuous Deployment**.
2. Find the **Ignore builds** section and click **Edit**.
3. Enter the following command exactly:
   \`\`\`bash
   git diff --quiet HEAD^ HEAD ./client/
   \`\`\`
*(This tells Netlify: "Check if the `client` folder changed. If it didn't change, cancel the build immediately to save my credits!")*

### Alternative Bypasses:
- **Lock Builds:** In Netlify, under "Deploys", you can click **"Stop auto publishing"**. This means pushing to GitHub will *never* build automatically. You will have to go to Netlify and manually click "Trigger deploy" when you are completely ready.
- **Deploy via CLI:** Install the Netlify CLI (`npm install -g netlify-cli`), run `npm run build` locally on your computer, and then run `netlify deploy --prod --dir=client/dist` to upload the static files directly. This uses **0 build minutes** on Netlify's servers!

---

## 2. Deploying the Backend (Server) to Render

Render is excellent for hosting Node.js + Express backends for free.

### Step 1: Push your code to GitHub
Make sure your entire `herbify` folder is pushed to a GitHub repository.

### Step 2: Create a Web Service on Render
1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `herbify` repository.

### Step 3: Configure the Web Service
Fill out the configuration exactly like this:
- **Name:** `herbify-backend` (or similar)
- **Language:** `Node`
- **Branch:** `main` (or `master`)
- **Root Directory:** `server` *(CRITICAL: This tells Render to only look at your backend folder)*
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

### Step 4: Add Environment Variables
Scroll down to **Environment Variables** and add all the variables from your `server/.env` file. 
*Note: You do NOT need `PORT` (Render handles this).*

- `NODE_ENV` = `production`
- `CLIENT_ORIGIN` = `https://your-future-netlify-url.netlify.app` *(You will update this later once Netlify is live)*
- `MONGODB_URI` = `your_mongodb_atlas_url`
- `JWT_ACCESS_SECRET` = `make_up_a_secure_long_random_string`
- `CLOUDINARY_CLOUD_NAME` = `...`
- `CLOUDINARY_API_KEY` = `...`
- `CLOUDINARY_API_SECRET` = `...`
- `RAZORPAY_KEY_ID` = `...`
- `RAZORPAY_KEY_SECRET` = `...`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` = `...`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` = `...`

Click **Deploy**. Once it's done, Render will give you a backend URL (e.g., `https://herbify-backend.onrender.com`). Copy this!

---

## 3. Deploying the Frontend (Client) to Netlify

Now that your backend is running on Render, let's deploy the React Vite frontend to Netlify.

### Step 1: Create a New Site on Netlify
1. Go to [Netlify.com](https://netlify.com).
2. Click **Add new site** -> **Import an existing project**.
3. Connect your GitHub and select the `herbify` repository.

### Step 2: Configure the Build Settings
Fill out the configuration exactly like this:
- **Base directory:** `client` *(CRITICAL)*
- **Build command:** `npm run build`
- **Publish directory:** `client/dist`

### Step 3: Add Environment Variables
Click on **Add environment variables** and add:
- **Key:** `VITE_API_URL`
- **Value:** *Paste the Render URL you copied earlier* (e.g., `https://herbify-backend.onrender.com`)

### Step 4: Add an _redirects file for React Router
Netlify needs to know how to handle React Router navigation.
1. In your local project, inside `client/public/`, create a file named `_redirects` (no extension).
2. Inside that file, paste this exact single line:
   \`\`\`
   /*    /index.html   200
   \`\`\`
*(This ensures users don't get 404 errors when refreshing different pages like `/cart` or `/login`)*

### Step 5: Deploy!
Click **Deploy Site**. Once it is live, visit the URL Netlify gives you to make sure it's working!

### Step 6: Finalizing CORS Connection
Remember that `CLIENT_ORIGIN` variable you left empty on the Render backend? 
1. Copy your new Netlify live URL (e.g., `https://herbify-frontend.netlify.app`).
2. Go back to your **Render dashboard** -> **Environment Variables**.
3. Find the `CLIENT_ORIGIN` variable and update it with your Netlify URL.
4. Render will automatically redeploy the backend with the new allowed origin!

🚀 You are now live!
