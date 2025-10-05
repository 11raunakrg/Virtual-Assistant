import multer from "multer";
import fs from "fs";

const folder = "./public";
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
export default upload;
