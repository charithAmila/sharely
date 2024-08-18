export const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
};

export const isUrl = (text: string) => {
    return text.startsWith("https://") || text.startsWith("http://");
}