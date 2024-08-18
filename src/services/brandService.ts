import Brand from '../models/Brand';
import fs from 'fs';
import path from 'path';
const checkIfBrandExists = async(
  options: { name?: string, id?: string },
): Promise<Brand | null> => {
  const { name, id } = options;
  const query: { [key: string]: string } = {};

  if (name) {
    query.name = name;
  }

  if (id) {
    query.id = id;
  }

  const existingBrand = await Brand.findOne({ where: query });
  return existingBrand;
};

const createImageFileName = (brandName: string, image: Express.Multer.File): string => {
  const fileExtension = path.extname(image.originalname);
  const brandImageFileName = `${brandName}${fileExtension}`;
  const imagePath = `./images/${brandImageFileName}`;
  return imagePath;
};
const renameFile = (oldName: string, newName: string): void => {
  fs.rename(oldName, newName, (err) => {
    if (err) {
      throw err;
    }
  });
};

const removeFile = (path: string): void => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
  });
};

const getTempName = (fileExtension: string): string => {
  return `./images/temp${fileExtension}`;
};
const updateImagePath = (oldPath: string, name: string): string => {
  // Find the last '/' to determine the prefix
  const lastSlashIndex = oldPath.lastIndexOf('/');
  const prefix = oldPath.substring(0, lastSlashIndex + 1);

  // Find the last '.' to determine the suffix
  const lastDotIndex = oldPath.lastIndexOf('.');
  const suffix = oldPath.substring(lastDotIndex);

  // Combine the prefix, new name, and suffix
  return `${prefix}${name}${suffix}`;
};
const isValidFileName = (name: string): boolean => {
  const notAllowedCharacters: RegExp = /[/\\?%*:|"<>]/;
	if (name.length === 0) return false;
	if (notAllowedCharacters.test(name)) return false;
	return true;
};
export {
  checkIfBrandExists,
  createImageFileName,
  renameFile,
  removeFile,
  getTempName,
  updateImagePath,
  isValidFileName,
};
