const Dataset = require('../models/XYZ'); 
const path = require('path');

exports.downloadFile = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);
    if (!dataset || dataset.status !== 'Approved') {
      return res.status(404).json({ msg: "Dataset not available" });
    }
    dataset.downloadCount += 1;
    await dataset.save();

    const filePath = path.join(__dirname, '..', dataset.fileUrl);
    res.download(filePath); 
  } catch (err) {
    res.status(500).send("Error downloading file");
  }
};
exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const { title, description } = req.body;
    
    const newDataset = new Dataset({
      title,
      description,
      fileUrl: req.file.path, 
      doctor: req.user.id
    });

    await newDataset.save();
    res.status(201).json({ msg: "Dataset uploaded successfully", newDataset });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
