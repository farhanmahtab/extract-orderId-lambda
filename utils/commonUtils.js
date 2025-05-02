const extractPath = (url) => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.slice(1);
};

module.exports = {
  extractPath,
};
