require("dotenv").config();
const { setConfig } = require("./config");
const { extractOrderId } = require("./services/extract-orderId-service");

exports.handler = async (event, context, callback) => {
  setConfig({ env: event.env });

  try {
    console.log("++ Environment:", event.env);
    await extractOrderId(event);
    return "!!!Completed!!!";
  } catch (error) {
    console.log("++ Function closed unexpectedly!!!", error);
  }
};
