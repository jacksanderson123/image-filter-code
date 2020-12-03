"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
(() => __awaiter(this, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // Tested with https://random.dog/b5cb2902-8c8b-4c0b-ac88-ee301aee91eb.jpg
    app.get("/filteredimage", function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageURL = req.query.image_url;
            console.log(imageURL);
            if (!util_1.checkImageURL(imageURL))
                res.status(400).send("Invalid url supplied");
            let filteredImage = yield util_1.filterImageFromURL(imageURL);
            console.log(filteredImage);
            res.status(200).sendFile(filteredImage, (err) => {
                if (err)
                    res.status(500).send("Internal Server error");
                // get directory path
                // delete the folder
                let imagePath = path_1.default.join(__dirname, "/util/tmp");
                fs_1.default.readdir(imagePath, function (err, files) {
                    if (err)
                        res.status(500).send("Internal Server error");
                    util_1.deleteLocalFiles(files.map((file) => imagePath + "/" + file));
                });
            });
        });
    });
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map