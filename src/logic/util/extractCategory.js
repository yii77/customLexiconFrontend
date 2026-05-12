export function extractCategory(library) {
  const map = {};
  const mySubcategories = new Set();

  library.forEach(wb => {
    if (wb.owner === 'system' && !wb.created_at) {
      const cat = wb.category;
      const subcat = wb.subcategory;

      if (!map[cat]) {
        map[cat] = new Set();
      }
      if (subcat) {
        map[cat].add(subcat);
      }
    } else if (wb.owner === 'system' && !!wb.created_at) {
      mySubcategories.add('下载');
    } else {
      if (wb.subcategory) {
        mySubcategories.add(wb.subcategory);
      }
    }
  });

  const categoryArray = ['我的', ...Object.keys(map)];

  const categoryMap = {
    我的:
      mySubcategories.size === 0
        ? null
        : ['全部', ...Array.from(mySubcategories)],
  };

  Object.entries(map).forEach(([name, subSet]) => {
    categoryMap[name] = ['全部', ...Array.from(subSet)];
  });

  return {
    categoryArray,
    categoryMap,
  };
}
