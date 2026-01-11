module.exports=[24868,(a,b,c)=>{b.exports=a.x("fs/promises",()=>require("fs/promises"))},32705,a=>{"use strict";var b=a.i(37936),c=a.i(61469),d=a.i(18558),e=a.i(24868),f=a.i(14747),g=a.i(63707);async function h(a){if(!a||0===a.size)return null;let b=await a.arrayBuffer(),c=Buffer.from(b),d=f.default.join(process.cwd(),"public","uploads");await (0,e.mkdir)(d,{recursive:!0});let g=`${Date.now()}-${a.name.replace(/\s/g,"_")}`,h=f.default.join(d,g);return await (0,e.writeFile)(h,c),`/uploads/${g}`}async function i(a){let b=await (0,g.getSession)();if(!b)return{error:"Não autorizado"};let e=Number(b.sub),f=parseFloat(a.get("weight")),i=parseFloat(a.get("price")),j=Number(a.get("gold_type_id")),k=Number(a.get("point_id")),l=a.get("customer"),m=a.get("receipt"),n=a.get("unit")||"g";if(!f||!i||!j||!k)return{error:"Preencha os campos obrigatórios."};"kg"===n&&(f*=1e3);try{let a=await h(m),b=new Date().toISOString();return c.default.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit) 
        VALUES ('BUY', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(f,i,l,a,b,j,k,e,n),(0,d.revalidatePath)("/dashboard/inventory"),(0,d.revalidatePath)("/dashboard/transactions"),{success:!0}}catch(a){return{error:a.message}}}async function j(a){let b=await (0,g.getSession)();if(!b)return{error:"Não autorizado"};let e=Number(b.sub),f=parseFloat(a.get("weight")),i=parseFloat(a.get("price")),j=Number(a.get("gold_type_id")),k=Number(a.get("point_id")),l=a.get("customer"),m=a.get("unit")||"g",n=a.get("delivery_courier"),o=0;if(n){let a=c.default.prepare("SELECT fee FROM couriers WHERE name = ? AND user_id = ?").get(n,e);a&&(o=a.fee||0)}let p=a.get("receipt");if(!f||!i||!j||!k)return{error:"Preencha os campos obrigatórios."};"kg"===m&&(f*=1e3);try{let a=await h(p),b=new Date().toISOString();return c.default.prepare(`
        INSERT INTO transactions (type, weight_grams, price, customer_name, receipt_path, date, gold_type_id, point_id, user_id, unit, delivery_courier, delivery_cost) 
        VALUES ('SELL', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(f,i,l,a,b,j,k,e,m,n,o),(0,d.revalidatePath)("/dashboard/inventory"),(0,d.revalidatePath)("/dashboard/transactions"),{success:!0}}catch(a){return{error:a.message}}}async function k(){let a=await (0,g.getSession)();if(!a)return[];let b=Number(a.sub),d=c.default.prepare(`
        SELECT t.type, t.weight_grams, gt.name as gold_name, p.name as point_name 
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
    `).all(b),e={};return d.forEach(a=>{let b=a.point_name||"Geral",c=a.gold_name||"Desconhecido",d=`${b}-${c}`;e[d]||(e[d]={point:b,gold:c,stock_grams:0}),"BUY"===a.type&&(e[d].stock_grams+=a.weight_grams),"SELL"===a.type&&(e[d].stock_grams-=a.weight_grams)}),Object.values(e).filter(a=>Math.abs(a.stock_grams)>.001)}async function l(){let a=await (0,g.getSession)();if(!a)return[];let b=Number(a.sub);return c.default.prepare(`
        SELECT t.*, gt.name as gold_name, p.name as point_name
        FROM transactions t
        LEFT JOIN gold_types gt ON t.gold_type_id = gt.id
        LEFT JOIN points p ON t.point_id = p.id
        WHERE t.user_id = ?
        ORDER BY date DESC
    `).all(b)}async function m(){let a=await (0,g.getSession)();if(!a)return[];let b=Number(a.sub);return c.default.prepare(`
        SELECT strftime('%Y-%m-%d', date) as date, SUM(price) as total
        FROM transactions
        WHERE type = 'SELL' AND user_id = ?
        GROUP BY date
        ORDER BY date ASC
        LIMIT 30
    `).all(b)}(0,a.i(13095).ensureServerEntryExports)([i,j,k,l,m]),(0,b.registerServerReference)(i,"40a6bd7a98cbdb2610d87168772495a140cc23b2bb",null),(0,b.registerServerReference)(j,"40f2e801184a8ed1f430e97bac6910394b6cc2bfc2",null),(0,b.registerServerReference)(k,"003324c74d0aa8c732b6ab05246d9f2eb2e7db5f56",null),(0,b.registerServerReference)(l,"00b1aa0a5aabcd51d7e4770e006ea38d2077a06119",null),(0,b.registerServerReference)(m,"00f8b6b51ec039725d13a2c470924b629bd2c60752",null),a.s(["buy",()=>i,"getDailySales",()=>m,"getInventory",()=>k,"getTransactions",()=>l,"sell",()=>j])},74622,a=>{"use strict";var b=a.i(63707),c=a.i(32705);a.s([],93301),a.i(93301),a.s(["001cff6da69649cb3538ebb44b85726acfda477617",()=>b.getSession,"003324c74d0aa8c732b6ab05246d9f2eb2e7db5f56",()=>c.getInventory,"00b1aa0a5aabcd51d7e4770e006ea38d2077a06119",()=>c.getTransactions,"00f5ae00e140bafd8c394ea98ad441ac36c1f2b778",()=>b.logout,"00f8b6b51ec039725d13a2c470924b629bd2c60752",()=>c.getDailySales,"400005926efb722f25cb6dbbee9d650d9ce8a30e42",()=>b.register,"40a6bd7a98cbdb2610d87168772495a140cc23b2bb",()=>c.buy,"40b73d41e742e5c9864de0c62d5bd2bf172ed6c6d1",()=>b.login,"40f2e801184a8ed1f430e97bac6910394b6cc2bfc2",()=>c.sell],74622)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__5b29677a._.js.map