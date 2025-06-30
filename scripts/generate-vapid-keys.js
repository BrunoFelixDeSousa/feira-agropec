#!/usr/bin/env node

const webpush = require('web-push');

console.log('🔑 Gerando novas VAPID keys para push notifications...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('📋 Adicione estas variáveis ao seu arquivo .env.local:\n');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_EMAIL=seu-email@dominio.com`);
console.log('\n⚠️  IMPORTANTE: Mantenha a chave privada em segredo!');
console.log('✅ A chave pública pode ser usada no cliente.');
