// server/api/export-pdf.post.ts
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const htmlContent = body?.html;

  if (!htmlContent) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing HTML payload for PDF generation',
    });
  }

  let browser = null;

  try {
    const isDev = process.env.NODE_ENV === 'development';

    // Launch Chrome (Local Chrome binary in dev, Sparticuz Chromium on Vercel)
    browser = await puppeteer.launch({
      args: isDev ? [] : chromium.args,
      defaultViewport: { width: 1200, height: 1600 },
      executablePath: isDev
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // Adjust for your OS if testing locally
        : await chromium.executablePath(),
      headless: isDev ? true : chromium.headless,
    });

    const page = await browser.newPage();

    // Wrap payload in standalone HTML document with Tailwind CDN for full styling parity
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
            @page { size: A4 portrait; margin: 0; }
          </style>
        </head>
        <body class="bg-white text-slate-900 p-0 m-0">
          ${htmlContent}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    // Render A4 PDF Buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();

    // Stream PDF back to client
    setResponseHeaders(event, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Joel_PINHO_CV.pdf"',
      'Content-Length': pdfBuffer.length.toString(),
    });

    return pdfBuffer;
  } catch (error) {
    if (browser) await browser.close();
    console.error('Server PDF Generation Error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate PDF on server',
    });
  }
});
