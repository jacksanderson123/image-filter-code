import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  checkImageURL,
} from "./util/util";
import e from "express";
import path from "path";
import fs from "fs";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Tested with https://random.dog/b5cb2902-8c8b-4c0b-ac88-ee301aee91eb.jpg
  app.get("/filteredimage", async function (req, res) {
    let imageURL = req.query.image_url;
    console.log(imageURL);

    if (!checkImageURL(imageURL)) res.status(400).send("Invalid url supplied");

    let filteredImage = await filterImageFromURL(imageURL);
    console.log(filteredImage);

    res.status(200).sendFile(filteredImage, (err) => {
      if (err) res.status(500).send("Internal Server error");

      // get directory path
      // delete the folder
      let imagePath = path.join(__dirname, "/util/tmp");

      fs.readdir(imagePath, function (err, files) {
        if (err) res.status(500).send("Internal Server error");
        deleteLocalFiles(files.map((file) => imagePath + "/" + file));
      });
    });
  });

  // Root Endpoint
  // Displays a simple message to the user

  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
