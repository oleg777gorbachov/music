export default async (imageURL: string) => {
  const res = await fetch(imageURL).then((response) => {
    return response.blob();
  });
  return res;
};
