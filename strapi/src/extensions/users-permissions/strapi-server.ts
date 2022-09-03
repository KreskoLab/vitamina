import { getService } from '@strapi/plugin-users-permissions/server/utils';
import { validateUpdateUserBody } from '@strapi/plugin-users-permissions/server/controllers/validation/user';
import { createHmac } from 'crypto'
import utils from '@strapi/utils';
import axios from 'axios'
import _ from 'lodash';

const { sanitize } = utils;
const { ApplicationError, NotFoundError } = utils.errors;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel('plugin::users-permissions.user');
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

function hashMerchantSecret(hashString: string): string {
  const hmac = createHmac('md5', process.env.MERCHANT_SECRET)
  hmac.update(hashString)

  return hmac.digest('hex')
}

async function sendEmial(to: string, subject: string, text: string) {
  await strapi.plugins['email'].services.email.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text
  })
}

export default (plugin) => {
  plugin.controllers.user['myOrder'] = async (ctx) => {     
    const ordersService = strapi.services['api::order.order']
    
    const orderId = ctx.request.query['id']
    const order = await ordersService.findOne(orderId)
    
    const customerEmail = order.userinfo.email

    if (order.userinfo.payment === 'cash') {
      await sendEmial(customerEmail, `Замовлення ${orderId}`, process.env.EMAIL_TEXT)
      ctx.send('pending')
    }

    else {
      const hashString = `${process.env.MERCHANT_ACCOUNT};${orderId}`
  
      const requestData = {
        transactionType: 'CHECK_STATUS',
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        orderReference: String(orderId),
        merchantSignature: hashMerchantSecret(hashString),
        apiVersion: "1"
      }        
  
      const res = await axios.post('https://api.wayforpay.com/api', JSON.stringify(requestData))  
  
      if (res.data.reasonCode === 1100) {
        await ordersService.update(orderId, { data: { paid: true } })
        await sendEmial(customerEmail, `Замовлення ${orderId}`, process.env.EMAIL_TEXT)

        ctx.send('success')
      } else ctx.send('error')
    }
  }

  plugin.controllers.user['createOrder'] = async (ctx) => {
    const { order, cart } = ctx.request.body    
    const { id } = ctx.state.user;

    if (id && (order.post.name === 'novaposhta' || order.post.name === 'ukrposhta')) {
      const body = {
        postcode: order.postcode || '',
        city: order.city || '',
        region: order.region || ''
      }

      const user = await getService('user').fetch(id);

      if (!user) {
        throw new NotFoundError(`User not found`);
      } else await getService('user').edit(id, body);
    }
        
    if (order.account) {
      const userExist = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: order.email }
      })      

      if (!userExist) {
        await strapi.plugins['users-permissions'].services.user.add({
          blocked: false,
          confirmed: true, 
          username: order.name + order.surname,
          email: order.email,
          name: order.name,
          surname: order.surname,
          phone: order.phone,
          region: order.region || '',
          city: order.city || '',
          postcode: order.postcode || '',
          password: 'secretpassword',
          provider: 'local',
          created_by: 1,
          updated_by: 1,
          role: 1
        });

        const helloMsg = `
          Вітаємо в родині Вітамінерія!
          Ваш акаунт ${order.email}
          Приємних покупок!
        `

        await sendEmial(order.email, 'Реєстрація', helloMsg)
      } else ctx.send('error');
    }

    const ordersService = strapi.services['api::order.order']

    const cartProductsIds = cart.map(item => item.id)

    const results = await strapi.entityService.findMany('api::product.product', { populate: '*' })
    
    const products = results.filter(item => cartProductsIds.includes(item.id))    

    const productName = []
    const productPrice = []
    const productCount = []

    cart.forEach(item => {
      const name = `${products.find(product => product.id === item.id).name} (${item.weight})`
      const price = products.find(product => product.id === item.id).prices[0].variants.find(variant => variant.weight === item.weight).price

      productName.push(name)
      productPrice.push(price)
      productCount.push(item.count)
    })

    const newOrder = await ordersService.create({ 
      data: {
        userinfo: order,
        products: [...cart], 
        date: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
        publishedAt: new Date(),
      }
    })    

    if (order.payment === 'cash') {
      ctx.send(newOrder.id)
    }

    else {
      const orderDate = new Date(newOrder.publishedAt).getTime()

      const hashProductsNames = productName.map(item => `${item};`).join('')
      const hashProductsCount = productCount.map(item => `${item};`).join('')  
      const hashProductsPrices = productPrice.map(item => `${item};`).join('').slice(0, -1)

      const sum = productPrice.reduce((acc, cv, i) => acc + cv * productCount[i], 0)

      const hashString = `${process.env.MERCHANT_ACCOUNT};${process.env.MERCHANT_DOMAIN};${newOrder.id};${orderDate};${sum};UAH;`
      const hex = hashString + hashProductsNames + hashProductsCount + hashProductsPrices

      const requestData = {
        merchantAccount: process.env.MERCHANT_ACCOUNT,
        merchantDomainName: process.env.MERCHANT_DOMAIN,
        merchantSignature: hashMerchantSecret(hex),
        currency: "UAH",
        amount: sum,
        language: "UA",
        returnUrl: `${process.env.MERCHANT_RETURN_URL}/order?id=${newOrder.id}` ,
        orderReference: String(newOrder.id),
        orderNo: String(newOrder.id), 
        orderDate: orderDate,
        productName: productName,
        productPrice: productPrice,
        productCount: productCount,
        clientEmail: order.email || '',
        clientPhone: order.phone || '',
        clientFirstName: order.name || '',
        clientLastName: order.surname || ''
      }        
          
      const res = await axios.post('https://secure.wayforpay.com/pay?behavior=offline', JSON.stringify(requestData))          

      if (res.data.url) {
        ctx.send(res.data.url);
      } else ctx.send('error');
    }
  }

  plugin.controllers.user['updateMe'] = async (ctx) => {    
    const advancedConfigs = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
      .get();

    const { id } = ctx.state.user;
    const { email } = ctx.request.body;

    const user = await getService('user').fetch(id);

    if (!user) {
      throw new NotFoundError(`User not found`);
    }

    await validateUpdateUserBody(ctx.request.body);

    if (_.has(ctx.request.body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: email.toLowerCase() } });

      if (userWithSameEmail && userWithSameEmail.id != id) {
        throw new ApplicationError('Email already taken');
      }

      ctx.request.body.email = ctx.request.body.email.toLowerCase();
    }

    let updateData = {
      ...ctx.request.body,
    };

    const data = await getService('user').edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedData);
  }

  plugin.routes['content-api'].routes.push(
    {
      method: 'PUT',
      path: '/me',
      handler: 'user.updateMe',
      config: {
        policies: [],
        prefix: '',
      }
    },
    {
      method: 'PUT',
      path: '/me/order',
      handler: 'user.createOrder',
      config: {
        policies: [],
        prefix: '',
      }
    },
    {
      method: 'GET',
      path: '/me/order',
      handler: 'user.myOrder',
      config: {
        policies: [],
        prefix: '',
      }
    }
  );

  return plugin;
}