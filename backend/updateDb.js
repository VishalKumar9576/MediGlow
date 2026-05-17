const mysql = require('mysql2/promise');

async function updateDb() {
  const c = await mysql.createConnection({
    host: 'interchange.proxy.rlwy.net',
    user: 'root',
    password: 'VkhxxHYBJLoQLPyVPrtlzgOLWPwfHLud',
    database: 'railway',
    port: 45210
  });
  
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/facewash.jpg' WHERE id = 1");
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/serum.jpg' WHERE id = 2");
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/moist.jpg' WHERE id = 3");
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/sunscreen.jpg' WHERE id = 4");
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/haircare.jpg' WHERE id = 5");
  await c.query("UPDATE categories SET image = '/src/assets/images/blogs/suppliment.jpg' WHERE id = 6");
  
  console.log('Updated categories');
  await c.end();
}

updateDb().catch(e => console.error(e));
