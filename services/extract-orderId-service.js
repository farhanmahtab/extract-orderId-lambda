const {
  TextractClient,
  DetectDocumentTextCommand,
} = require("@aws-sdk/client-textract");
const { extractPath } = require("../utils/commonUtils");
require("dotenv").config();

const extractOrderId = async (event) => {
  const textractClient = new TextractClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const { fileName } = event.body;

  if (!fileName) {
    console.log("No fileName provided.");
    return;
  }

  const file = extractPath(fileName);

  const params = {
    Document: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: file,
      },
    },
  };

  try {
    console.log("Calling Textract to detect text...");

    const command = new DetectDocumentTextCommand(params);
    const textractData = await textractClient.send(command);
    const jsonData = textractData.Blocks;

    console.log("Textract response received jsonData.");

    const lineBlocks = jsonData.filter((block) => block.BlockType === "LINE");

    let invoiceNumberBlock = null;

    let success = false;

    let invoiceNumber = null;

    lineBlocks.forEach((block, index) => {
      const blockText = block.Text;

      const invoiceNumberPattern = /^\d{4}-\d{4}-\d{4}$/;
      if (invoiceNumberPattern.test(blockText)) {
        invoiceNumberBlock = block;
        invoiceNumber = blockText;
      }
    });

    if (invoiceNumberBlock) {
      success = true;
      console.log("Detected invoice block (with dashes): ", invoiceNumber);
    }

    if (!success) {
      console.log("Failed to detect invoice fields.");
      return null;
    }
    return invoiceNumber;
  } catch (error) {
    console.error("Error occurred while detecting text:", error);
    return null;
  }
};

module.exports = {
  extractOrderId,
};
