import { Request, Response } from "express";
import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  checkImageURL,
} from "./util/util";

import path from "path";
import fs from "fs";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //! END @TODO1
  app.get("/filteredimage", async function (req: Request, res: Response) {
    console.log(req.query.image_url);

    let imageURL = req.query.image_url;

    if (!checkImageURL(imageURL)) res.status(400).send("Invalid url supplied");
    let filteredImage = await filterImageFromURL(imageURL);

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

  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
