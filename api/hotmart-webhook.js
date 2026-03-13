const https = require('https');
const crypto = require('crypto');

const PINTEREST_AD_ACCOUNT_ID = process.env.PINTEREST_AD_ACCOUNT_ID;
const PINTEREST_ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN;
const PIXEL_ID = '2614321075437';

// Map Hotmart offer codes → product info
const OFFERS = {
  'pxo5cqtf': { name: 'Kerzen Business Akademie – Vollkurs',    value: 27.00 },
  'doweto6q': { name: 'Kerzen Business Akademie – 50% OFF',     value: 13.50 },
  'ro5ifmom': { name: 'Kerzen Business Akademie – 70% OFF',     value: 8.10  },
};

function sha256(str) {
  return crypto.createHash('sha256').update((str || '').toLowerCase().trim()).digest('hex');
}

function sendPinterestEvent(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const options = {
      hostname: 'api.pinterest.com',
      path: `/v5/ad_accounts/${PINTEREST_AD_ACCOUNT_ID}/events`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;

    // Only process completed purchases
    const status = event?.data?.purchase?.status || event?.event;
    if (status !== 'PURCHASE_COMPLETE' && status !== 'approved') {
      return res.status(200).json({ ignored: true, status });
    }

    const offerCode = event?.data?.purchase?.offer?.code || '';
    const offer = OFFERS[offerCode];
    const value = offer?.value ?? event?.data?.purchase?.price?.value ?? 0;
    const productName = offer?.name ?? 'Kerzen Business Akademie';

    const buyerEmail = event?.data?.buyer?.email || '';
    const buyerName  = event?.data?.buyer?.name  || '';
    const transactionId = event?.data?.purchase?.transaction || '';
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || '';
    const userAgent = event?.data?.purchase?.user_agent || '';

    const payload = {
      data: [{
        event_name: 'checkout',
        action_source: 'web',
        event_time: Math.floor(Date.now() / 1000),
        event_id: transactionId,
        event_source_url: 'https://kerzenbusinessakademie.site',
        user_data: {
          em: [sha256(buyerEmail)],
          fn: [sha256(buyerName.split(' ')[0] || '')],
          ln: [sha256(buyerName.split(' ').slice(1).join(' ') || '')],
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: {
          currency: 'EUR',
          value: String(value),
          order_id: transactionId,
          content_ids: [offerCode],
          content_name: productName,
          num_items: 1,
        },
      }],
    };

    const result = await sendPinterestEvent(payload);
    console.log('Pinterest CAPI response:', result.status, result.body);

    return res.status(200).json({ ok: true, pinterest: result.status });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
};
