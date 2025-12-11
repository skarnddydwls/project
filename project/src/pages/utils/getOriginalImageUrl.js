export const getOriginalImageUrl = (url) => {
  if (!url) return "";
  return url.split("?")[0];   // ? 기준으로 앞부분만 사용
};