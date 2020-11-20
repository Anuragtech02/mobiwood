const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");

const mkdirp = require("mkdirp-promise");
const spawn = require("child-process-promise").spawn;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const path = require("path");
const os = require("os");
const fs = require("fs");

const THUMB_MAX_WIDTH = 300;

// exports.helloWorld = functions.storage.object().onFinalize((event) => {
//   console.log(event);
//   const bucket = event.bucket;
//   const contentType = event.contentType;
//   const filePath = event.name;
//   console.log("file detected");
//   console.log({ bucket });

//   if (path.basename(filePath).startsWith("renamed-")) {
//     console.log("already renamed this file");
//     return;
//   }

//   const storage = new Storage();
//   const destBucket = storage.bucket(bucket);
//   const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
//   const metadata = { contentType: contentType };
//   return destBucket
//     .file(filePath)
//     .download({
//       destination: tmpFilePath,
//     })
//     .then(() => {
//       return destBucket.upload(tmpFilePath, {
//         destination: "users/renamed-" + path.basename(filePath),
//         metadata: metadata,
//       });
//     });
// });

function generateFromVideo(file, tempLocalThumbFile) {
  return file
    .getSignedUrl({ action: "read", expires: "05-24-2999" })
    .then((signedUrl) => {
      const fileUrl = signedUrl[0];
      const promise = spawn(ffmpegPath, [
        "-ss",
        "0",
        "-i",
        fileUrl,
        "-f",
        "image2",
        "-vframes",
        "1",
        "-vf",
        `scale=${THUMB_MAX_WIDTH}:-1`,
        tempLocalThumbFile,
      ]);
      // promise.childProcess.stdout.on('data', (data) => console.info('[spawn] stdout: ', data.toString()));
      // promise.childProcess.stderr.on('data', (data) => console.info('[spawn] stderr: ', data.toString()));
      return promise;
    });
}
function generateFromImage(file, tempLocalThumbFile, fileName) {
  const tempLocalFile = path.join(os.tmpdir(), fileName);

  // Download file from bucket.
  return file
    .download({ destination: tempLocalFile })
    .then(() => {
      console.info("The file has been downloaded to", tempLocalFile);
      // Generate a thumbnail using ImageMagick with constant width and variable height (maintains ratio)
      return spawn(
        "convert",
        [tempLocalFile, "-thumbnail", THUMB_MAX_WIDTH, tempLocalThumbFile],
        { capture: ["stdout", "stderr"] }
      );
    })
    .then(() => {
      fs.unlinkSync(tempLocalFile);
      return Promise.resolve();
    });
}

exports.createThumbnail = functions.storage
  .object()
  .onFinalize(async (event) => {
    const bucket = event.bucket;
    const filePath = event.name;
    const resourceState = event.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = event.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    const contentType = event.contentType; // This is the image MIME type
    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");

    if (path.basename(filePath).startsWith("thumbnail-")) {
      console.log("Already Extracted Frame");
      return;
    }

    const storage = new Storage();
    const destBucket = storage.bucket(bucket);
    // const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));

    // Exit if this is a move or deletion event.
    if (resourceState === "not_exists") {
      return Promise.resolve();
    }
    // Exit if file exists but is not new and is only being triggered
    // because of a metadata change.
    else if (resourceState === "exists" && metageneration > 1) {
      return Promise.resolve();
    }
    // Exit if the image is already a thumbnail.
    else if (filePath.indexOf(".thumbnail.") !== -1) {
      return Promise.resolve();
    }
    // Exit if this is triggered on a file that is not an image or video.
    else if (!(isImage || isVideo)) {
      return Promise.resolve();
    }

    const fileDir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const fileInfo = parseName(fileName);
    const thumbFileExt = isVideo ? "jpg" : fileInfo.ext;
    let thumbFilePath = path.normalize(
      path.join(
        fileDir,
        `${fileInfo.name}_${fileInfo.timestamp}.thumbnail.${thumbFileExt}`
      )
    );
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    const tempLocalDir = path.join(os.tmpdir(), fileDir);
    const generateOperation = isVideo ? generateFromVideo : generateFromImage;

    // Cloud Storage files.
    const file = destBucket.file(filePath);

    const metadata = {
      contentType: isVideo ? "image/jpeg" : contentType,
      // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
      "Cache-Control": "public,max-age=3600",
    };

    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir)
      .then(() => {
        return generateOperation(file, tempLocalThumbFile, fileName);
      })
      .then(() => {
        console.info("Thumbnail created at", tempLocalThumbFile);
        // Get the thumbnail dimensions
        return spawn(
          "identify",
          ["-ping", "-format", "%wx%h", tempLocalThumbFile],
          { capture: ["stdout", "stderr"] }
        );
      })
      .then((result) => {
        const dim = result.stdout.toString();
        const idx = thumbFilePath.indexOf(".");

        thumbFilePath = `${thumbFilePath.substring(
          0,
          idx
        )}_${dim}${thumbFilePath.substring(idx)}`;
        console.info("Thumbnail dimensions:", dim);
        // Uploading the Thumbnail.
        return destBucket.upload(tempLocalThumbFile, {
          destination: thumbFilePath,
          metadata: metadata,
        });
      })
      .then(() => {
        console.info("Thumbnail uploaded to Storage at", thumbFilePath);

        const thumbFilename = path.basename(thumbFilePath);

        return updateDatabase(fileDir, fileName, thumbFilename);
      })
      .then(() => {
        console.info("Thumbnail generated.");

        fs.unlinkSync(tempLocalThumbFile);

        return Promise.resolve();
      });
  });

const updateDatabase = () => {
  console.log("Updated DB");
};

const parseName = (fileName) => {
  return {
    name: path.basename(fileName),
    ext: path.basename(fileName).split(".").pop(),
  };
};
