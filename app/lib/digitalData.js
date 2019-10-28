function getPageName(categories) {
  return `nhs:web:${categories.join(':')}`;
}

function getCategories(path) {
  // Max 4 categories, additional URL segments are ignored
  return path.split('/').filter(Boolean).splice(0, 4);
}

function digitalData(req) {
  const path = req.path;
  const categories = getCategories(path);
  return {
    page: {
      category: {
        primaryCategory: categories[0],
        subCategory1: categories[1],
        subCategory2: categories[2],
        subCategory3: categories[3],
      },
      pageInfo: {
        pageName: getPageName(categories),
      },
    },
  };
}

module.exports = digitalData;
