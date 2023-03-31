const multer = require('multer')
const path = require('path')
const sharp = require('sharp');
const fs = require("fs")

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname));
        // cb(null, path.join(__dirname, "../public/images"));

    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.filename + "-" + uniqueSuffix + ".jpeg")
    },
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb({
            message: "Unspotted file formet"
        }, false)
    }
}
const uploadphoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 20000000 }

});

const productimgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path).resize(650, 570).toFormat('jpg').jpeg({ quality: 99 })
                .toFile(`./public/images/products/${file.filename}`)
            fs.unlinkSync(`./public/images/products/${file.filename}`)
        })
    );
    next();
};
const blogimgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path).resize(650, 570).toFormat('jpg').jpeg({ quality: 99 })
                .toFile(`./public/images/blogs/${file.filename}`)
            fs.unlinkSync(`./public/images/blogs/${file.filename}`)

        })
    );
    next();
};

module.exports = { uploadphoto, productimgResize, blogimgResize }