const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

exports.getIndexOverview = async (req, res) => {
  try {
    const results = [];
    const filePath = path.join(__dirname, "../datasets/nifty_index.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        if (results.length < 2) {
          return res.status(400).json({ message: "Not enough data" });
        }

        const last = results[results.length - 1];
        const prev = results[results.length - 2];

        const lastClose = parseFloat(last.Close);
        const prevClose = parseFloat(prev.Close);

        const change = lastClose - prevClose;
        const changePct = ((change / prevClose) * 100).toFixed(2);

        res.json({
          summary: {
            lastClose: lastClose.toFixed(2),
            change: change.toFixed(2),
            changePct,
          },
          history: results.slice(-100), // last 100 days
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Index data error" });
  }
};
