import express from "express";
import bodyParser from "body-parser";
import {
  filterImageFromURL,
  deleteLocalFiles,
  checkImageURL,
} from "./util/util";
import e from "express";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  // Tested with https://random.dog/b5cb2902-8c8b-4c0b-ac88-ee301aee91eb.jpg
  app.get("/filteredimage", async function (req, res) {
    let imageURL = req.query.image_url;
    console.log(imageURL);

    if (!checkImageURL(imageURL)) res.status(400).send("Invalid url supplied");

    let filteredImage = await filterImageFromURL(imageURL);
    console.log(filteredImage);

    res.status(200).sendFile(filteredImage, (err) => {
      if (err) res.status(500).send("Internal Server error");
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
