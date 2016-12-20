'use strict';
const aws = require('aws-sdk');
const _ = require('lodash/fp');
const dynamo = new aws.DynamoDB.DocumentClient();

module.create = (event, context) => {
  const payload = {
      TableName: 'orders',
    Item: event.body
  };

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error creating order');
    } else {
      console.log(data);
      context.succeed(data);
    }
  }

  dynamo.put(payload, cb);
};

module.show = (event, context)  => {
  const payload = {
    TableName: 'orders',
    Key: {
      orderId: event.params.path.orderId
    }
  }

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error retrieving order');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

  dynamo.get(payload, cb);
};

module.list = (event, context) => {
	const payload = {
		TableName: 'orders'
	}

	const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error getting orders');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

	dynamo.scan(payload, cb);
}

module.update = (event, context) => {
  const payload = {
    TableName: 'orders',
    Key: {
      orderId: event.params.path.orderId
    }
  };

  dynamo.get(payload, (err, data) => {
    if (err) {
      console.log(err);
      context.fail('No order with that id exists.');
    } else {
      const item = _.merge(data.Item, event.body);
      payload.Item = item;

      dynamo.put(payload, (putErr, putData) => {
        if (putErr) {
          console.log('Error updating order.');
          console.log(putErr);
          context.fail('Error updating order.');
        } else {
          console.log('Success!');
          console.log(putData);
          context.done(null, item);
        }
      });
    }
  });
}

module.delete = (event, context) => {
  const payload = {
    TableName: 'orders',
    Key: {
      orderId: event.params.path.orderId
    }
  };

  const cb = (err, data) => {
    if (err) {
      console.log(err);
      context.fail('Error retrieving order');
    } else {
      console.log(data);
      context.done(null, data);
    }
  }

  dynamo.delete(payload, cb);
};
