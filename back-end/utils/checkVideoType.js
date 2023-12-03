async function checkFile(fileBuffer, res) {
  const uInt8Arr = new Uint8Array(fileBuffer).subarray(0, 8); // bytes offset
  let fileType = "";
  uInt8Arr.forEach((val) => {
    fileType += val.toString(16);
  });
  // mp4 signature binary
  const verifiedFileType = (fileType.match(/66747970/gi)) ? true
    : (fileType.match(/1A45DFA3/gi)) ? true : !!(fileType.match(/3026B275/gi));
  // mkv                                       //wmv
  if (!verifiedFileType) {
    return res.status(400).json({ error: true, message: "File type is not supported" });
  }
  return "";
}

module.exports = { checkFile };
