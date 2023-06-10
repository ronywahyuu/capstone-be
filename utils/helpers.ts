export const imgPathGenerator = (req: any, res: any) => {
  const baseUrl = req.protocol + "://" + req.get("host");

  let imgPath: string | undefined;

  if (req.file) {
    imgPath = baseUrl + "/uploads/img/" + req.file?.filename;
  }

  return imgPath;
};
