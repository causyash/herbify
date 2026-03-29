import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const dir = '/Users/yash/Desktop/Home/herbify/internship_report/screenshots/';

    // Home
    await page.goto('http://localhost:5175/');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: dir + 'homepage.png' });

    // Login
    await page.goto('http://localhost:5175/auth');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: dir + 'login.png' });

    // Admin Dashboard
    await page.goto('http://localhost:5175/admin');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: dir + 'admin.png' });

    // Product Management (Admin)
    await page.goto('http://localhost:5175/admin/products');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: dir + 'dashboard.png' });

    // API Testing -> Change to Cart screenshot
    await page.goto('http://localhost:5175/cart');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: dir + 'postman.png' }); // keep exactly same name so HTML refers to it

    await browser.close();
    console.log("Screenshots captured");
})();
