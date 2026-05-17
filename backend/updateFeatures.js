const mysql = require('mysql2/promise');

async function updateFeatures() {
  const c = await mysql.createConnection({
    host: 'interchange.proxy.rlwy.net',
    user: 'root',
    password: 'VkhxxHYBJLoQLPyVPrtlzgOLWPwfHLud',
    database: 'railway',
    port: 45210
  });
  
  await c.query("UPDATE features SET image_url = '/src/assets/images/collections/cod.png' WHERE id = 1");
  await c.query("UPDATE features SET image_url = '/src/assets/images/collections/free.png' WHERE id = 2");
  await c.query("UPDATE features SET image_url = '/src/assets/images/collections/certified.png' WHERE id = 3");
  await c.query("UPDATE features SET image_url = '/src/assets/images/collections/dermatologist.png' WHERE id = 4");
  
  console.log('Updated features');
  await c.end();
}

updateFeatures().catch(e => console.error(e));
