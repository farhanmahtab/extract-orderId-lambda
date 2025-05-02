const {
  TextractClient,
  DetectDocumentTextCommand,
} = require("@aws-sdk/client-textract");
require("dotenv").config();

const textractClient = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const extractOrderId = async (event) => {
  const { fileName } = event.body;

  if (!fileName) {
    console.log("No fileName provided.");
    // return res.status(400).send("No file name provided.");
  }

  const params = {
    Document: {
      S3Object: {
        Bucket: process.env.S3_BUCKET_NAME,
        Name: fileName,
      },
    },
  };

  console.log({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET_NAME,
    fileName,
  });
  try {
    console.log("Calling Textract to detect text...");

    const command = new DetectDocumentTextCommand(params);
    const textractData = await textractClient.send(command);
    const jsonData = textractData.Blocks;

    console.log("Textract response received jsonData.");
    console.log(jsonData);

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
    }

    // res.json({
    //   status: success ? "success" : "fail",
    //   invoiceData: {
    //     invoiceNumber,
    //   },
    // });
  } catch (error) {
    console.error("Error occurred while detecting text:", error);
    // res.status(500).json({
    //   status: "error",
    //   message: "An error occurred while detecting text.",
    // });
  }
};

module.exports = {
  extractOrderId,
};
