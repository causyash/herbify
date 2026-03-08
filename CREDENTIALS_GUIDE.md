# 🌿 Herbify: Genuine Credentials Guide

Follow these steps to get real credentials for Email OTPs and Admin Notifications.

---

## 1. Real Email OTP (Gmail SMTP)
To send actual verification emails to users, follow these steps using a Gmail account:

1.  **Enable 2-Step Verification**: Go to your [Google Account Security](https://myaccount.google.com/security) and ensure 2-Step Verification is **ON**.
2.  **Generate App Password**:
    *   In the search bar of your Google Account, type **"App passwords"**.
    *   Select **App passwords**.
    *   Enter a name (e.g., "Herbify Website").
    *   Click **Create**.
3.  **Copy the Code**: Copy the 16-character code displayed in the yellow box.
4.  **Update `.env`**:
    ```env
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # Paste the 16-character code here
    EMAIL_FROM="Herbify <your-email@gmail.com>"
    ```

---

## 2. Admin Notifications (Free: Telegram)
Since native SMS APIs in India require paid recharges, we use a **Telegram Bot** for free, instant notifications on your phone.

### **Step 1: Create a Bot**
1.  Search for **@BotFather** on Telegram and start a chat.
2.  Send `/newbot` and follow the steps to name your bot.
3.  Copy the **HTTP API Token** (e.g., `123456:ABC-DEF123...`).
4.  Paste it into `TELEGRAM_BOT_TOKEN` in your `.env`.

### **Step 2: Get your Chat ID**
1.  Search for your new bot on Telegram and send it a message like "hello".
2.  Search for **@userinfobot** on Telegram and start a chat.
3.  It will reply with your **Id** (a number like `987654321`).
4.  Paste it into `TELEGRAM_CHAT_ID` in your `.env`.

### **Step 3: Update `.env`**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## 3. Image Uploads (Cloudinary)
To allow the admin to upload real product images:

1.  **Sign Up**: Create an account at [Cloudinary.com](https://cloudinary.com/).
2.  **Dashboard**: Copy your **Cloud Name**, **API Key**, and **API Secret**.
3.  **Update `.env`**:
    ```env
    CLOUDINARY_CLOUD_NAME=xxxxxx
    CLOUDINARY_API_KEY=xxxxxxxxxxxxxxx
    CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
    ```

---

## 4. Payments (Razorpay)
To simulate real payment flows (in test mode):

1.  **Sign Up**: Create an account at [Razorpay.com](https://razorpay.com/).
2.  **Test Mode**: Ensure you are in **"Test Mode"** (usually a toggle in the top-right).
3.  **Generate Keys**: Go to **Settings > API Keys** and click **Generate Key**.
4.  **Update `.env`**:
    ```env
    RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
    ```

---

### **Final Step: Apply Changes**
After getting all credentials, update your `/server/.env` file and **restart your server**:
```bash
cd server && npm run dev
```
