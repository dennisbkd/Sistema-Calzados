import bcrypt from 'bcrypt';

const password = 'admin123';
const hash = await bcrypt.hash(password, 10);

console.log('\n🔐 HASH GENERADO:');
console.log(hash);
console.log('\n📋 Usa este hash en el UPDATE de SQL\n');