const mysql = require('mysql2/promise');

async function updateBanners() {
  const c = await mysql.createConnection({
    host: 'interchange.proxy.rlwy.net',
    user: 'root',
    password: 'VkhxxHYBJLoQLPyVPrtlzgOLWPwfHLud',
    database: 'railway',
    port: 45210
  });

  const [banners] = await c.query('SELECT id, type, sort_order FROM banners ORDER BY type, sort_order, id');
  
  let promoCount = 0;
  let dualCount = 0;
  const promoImages = ['banner1.png', 'banner2.png', 'banner3.png', 'banner4.png'];
  const dualImages = ['banner2.png', 'banner3.png'];

  for (const b of banners) {
    let newImage = '';
    if (b.type === 'promo') {
      newImage = `/src/assets/images/home/${promoImages[promoCount % promoImages.length]}`;
      promoCount++;
    } else if (b.type === 'dual') {
      newImage = `/src/assets/images/home/${dualImages[dualCount % dualImages.length]}`;
      dualCount++;
    }
    await c.query('UPDATE banners SET image_url = ? WHERE id = ?', [newImage, b.id]);
  }
  
  console.log('Updated banners');
  await c.end();
}

updateBanners().catch(e => console.error(e));
