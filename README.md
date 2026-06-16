# Rasoi Sakhi - Premium Ready-to-Cook Vegetable Platform

Rasoi Sakhi is a premium, mobile-first food-tech e-commerce platform that delivers hygienically prepared, bubble-washed, UV-sanitized, peeled, and precision-cut vegetables directly to customers in Bharuch, Gujarat.

This project is built using a lightweight Node.js/Express backend paired with an atomic JSON-based database (`data/db.json`), making it highly stable and perfect for hosting on **Render's free tier (512MB RAM)** without OOM crashes. The frontend is a single-page web app built using pure HTML, Vanilla CSS, and JavaScript with embedded SVG graphics for fast, asset-free loading.

---

## Features

1. **Aesthetic Minimalist UI**: Fluid, box-less single-page scrolling layout optimized for mobile and desktop screens.
2. **Interactive Shop**: Live search, category filtering, product modal drawers, and responsive cart managers.
3. **WhatsApp Ordering**: Formats customer name, address, landmark, items ordered, and delivery slots into a clean text message and opens WhatsApp automatically.
4. **Google Sheets Webhook Sync**: Syncs new orders directly to your Excel/Google Sheet in real-time.
5. **Secure Admin Dashboard**: 
   - View orders, update status, and search/filter customers.
   - **Export to Excel (CSV)**.
   - Add, edit, or delete products in real-time.
   - Configure delivery charges and webhook URLs.

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (custom HSL tokens), ES6 JavaScript
- **Backend**: Node.js, Express, JWT (Authentication), bcryptjs (Hashing), dotenv
- **Database**: Local atomic JSON store (`data/db.json`) with automated backup-safety.

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18.0.0 or higher) installed.

### 2. Installation
Open your terminal in the project directory (`c:\Users\dhruv\Downloads\GROWN WINGS\RASOI SAKHI`) and run:
```bash
npm install
```

### 3. Running Locally
To launch the development server, run:
```bash
npm run dev
```
The application will boot on **`http://localhost:3000`**. Open this link in your browser.

---

## Admin Credentials & Security

The Admin Dashboard is protected by a secure JSON Web Token (JWT).
- **Default Username**: `admin`
- **Default Password**: `admin123`

To access the dashboard, click the **Profile Icon (⚙️)** in the top right on desktop, or the **Admin (⚙️)** tab in the bottom bar on mobile.

---

## Webhook Sync: Pushing Orders to Google Sheets

To automatically receive order details directly in a Google Sheet:
1. Open a new **Google Sheet**.
2. Go to **Extensions > Apps Script**.
3. Clear the default script and paste the code below:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     
     // Append a new row with order data
     sheet.appendRow([
       data.orderId,
       data.date,
       data.customerName,
       data.phone,
       data.email,
       data.address,
       data.landmark,
       data.items,
       data.subtotal,
       data.deliveryCharge,
       data.totalAmount,
       data.paymentMethod,
       data.deliverySlot,
       data.status
     ]);
     
     return ContentService.createTextOutput(JSON.stringify({result: "success"}))
                          .setMimeType(ContentService.MimeType.JSON);
   }
   ```
4. Click **Deploy > New Deployment**.
5. Select **Web App** as the deployment type.
6. Configure the options:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone** (This allows the Render backend server to securely push data).
7. Click **Deploy** and copy the generated **Web App URL**.
8. Log in to the Rasoi Sakhi Admin Panel, go to the **Settings** tab, paste the URL into the **Google Sheets Webhook URL** field, and click **Save Settings**.
9. All future orders will now automatically populate your spreadsheet!

---

## Production Deployment (Render Free Tier)

This platform is ready to deploy directly to [Render](https://render.com).
1. Push this directory to your personal GitHub repository.
2. Log in to Render, click **New > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. In the **Environment Variables** tab, add:
   - `JWT_SECRET`: (Set to a random secret phrase to protect login tokens)
6. Click **Deploy**. Your service will be online shortly!
