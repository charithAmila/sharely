export const truncateText = (text: string, maxLength: number) => {
    if (!text) {
        return text;
    }
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
};

export const isUrl = (text: string) => {
    return text.startsWith("https://") || text.startsWith("http://");
}

export const groupByCreatedAt=(array: SharedItem[]): GroupedSharedItem[] => {
    const groupedMap: { [key: string]: SharedItem[] } = {};
    
    array.forEach((item : SharedItem) => {      
      if (!groupedMap[new Date(item.createdAt).toLocaleDateString()]) {
        groupedMap[new Date(item.createdAt).toLocaleDateString()] = [];
      }
      groupedMap[`${new Date(item.createdAt).toLocaleDateString()}`].push({ ...item });
    });
  
    return Object.keys(groupedMap).map(createdAt => ({
      createdAt,
      data: groupedMap[createdAt],
    }));
}