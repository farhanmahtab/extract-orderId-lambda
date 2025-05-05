require("dotenv").config();
const { setConfig } = require("./config");
const { extractOrderId } = require("./services/extract-orderId-service");

exports.handler = async (event, context, callback) => {
  setConfig({ env: event.env });

  try {
    return await extractOrderId(event);
  } catch (error) {
    console.log("++ Function closed unexpectedly!!!", error);
  }
};
