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

export default (plugin) => {
  plugin.controllers.user['myOrder'] = async (ctx) => { 
    const ordersService = strapi.services['api::order.order']
    const orderId = ctx.request.query['orderId']

    const hashString = `${process.env.MERCHANT_ACCOUNT};${orderId}`
    const hmac = createHmac('md5', process.env.MERCHANT_SECRET)

    hmac.update(hashString)

    const hex = hmac.digest('hex')

    const requestData = {
      transactionType: 'CHECK_STATUS',
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      orderReference: String(orderId),
      merchantSignature: hex,
      apiVersion: "1"
    }        

    try {
      const res = await axios.post('https://api.wayforpay.com/api', JSON.stringify(requestData))  

      if (res.data.reasonCode === 1100) {
        await ordersService.update(orderId, { data: { paid: true } })
        ctx.send('success')
      } else ctx.send('error')
    } catch (error) {
      console.log(error);
      ctx.send('error')
    }
  }

  plugin.controllers.user['createOrder'] = async (ctx) => {
    const { userSettings, cart } = ctx.request.body    

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

    const order = await ordersService.create({ 
      data: {
        userinfo: [...userSettings],
        products: [...cart], 
        date: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
        publishedAt: new Date(),
      }
    })    

    const orderDate = new Date(order.publishedAt).getTime()

    const hashProductsNames = productName.map(item => `${item};`).join('')
    const hashProductsCount = productCount.map(item => `${item};`).join('')  
    const hashProductsPrices = productPrice.map(item => `${item};`).join('').slice(0, -1)

    const sum = productPrice.reduce((acc, cv, i) => acc + cv * productCount[i], 0)

    const hashString = `${process.env.MERCHANT_ACCOUNT};${process.env.MERCHANT_DOMAIN};${order.id};${orderDate};${sum};UAH;`

    const hmac = createHmac('md5', process.env.MERCHANT_SECRET)
    hmac.update(hashString + hashProductsNames + hashProductsCount + hashProductsPrices)

    const hex = hmac.digest('hex')

    const requestData = {
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      merchantDomainName: process.env.MERCHANT_DOMAIN,
      merchantSignature: hex,
      currency: "UAH",
      amount: sum,
      language: "UA",
      returnUrl: `${process.env.MERCHANT_RETURN_URL}/order?orderId=${order.id}` ,
      orderReference: String(order.id),
      orderNo: String(order.id), 
      orderDate: orderDate,
      productName: productName,
      productPrice: productPrice,
      productCount: productCount,
      clientEmail: userSettings.email || '',
      clientPhone: userSettings.phone || '',
      clientFirstName: userSettings.name || '',
      clientLastName: userSettings.surname || ''
    }    

    console.log(requestData);
    
    
    try {
      const res = await axios.post('https://secure.wayforpay.com/pay?behavior=offline', JSON.stringify(requestData))              
      ctx.send(res.data.url);
    } catch (error) {
      ctx.send('error')
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