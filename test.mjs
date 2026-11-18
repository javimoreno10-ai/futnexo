import {calculate} from './calculator.js';
import assert from 'node:assert/strict';
const near=(a,b)=>assert.ok(Math.abs(a-b)<0.011,`${a} != ${b}`);
let r=calculate({fan:{quantity:2,price:29.99}});near(r.revenue,50.983);near(r.cost1,29.9122);near(r.cost2,21.2748);near(r.profit,29.7082);assert.equal(r.supplier,'CHINO 2');assert.equal(r.discountPct,15);
r=calculate({fan:{quantity:1}});near(r.customerShipping,2.99);near(r.revenue,32.98);
r=calculate({fan:{quantity:2},training:{quantity:1}});assert.equal(r.eligibleCount,2);assert.equal(r.n,3);assert.equal(r.supplier,'CHINO 1');assert.equal(r.customerShipping,0);
r=calculate({training:{quantity:5}});assert.equal(r.discountPct,0);assert.equal(r.eligibleCount,0);
console.log('Todas las pruebas correctas');
