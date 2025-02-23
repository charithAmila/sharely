export const bySearchText = (
  groupedSharedItem: GroupedSharedItem,
  searchText: string,
  tags: Tag[]
) => {
  if (!searchText) return true;

  if (groupedSharedItem.data.length > 0) {
    return groupedSharedItem.data.some((item: SharedItem) => {
      return (
        (item?.note || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (item?.metadata?.title || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (item?.metadata?.description || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (item?.metadata?.publisher || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        (item?.metadata?.author || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        searchByTag(item.tags, searchText, tags)
      );
    });
  }

  return false;
};

const searchByTag = (tagIds: string[], searchText: string, tags: Tag[]) => {
  return tagIds.some((tagId) => {
    const tag = tags.find((tag) => tag.id === tagId);
    return tag?.name.toLowerCase().includes(searchText.toLowerCase());
  });
};
