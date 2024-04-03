const fs = require("fs");

// Read the CSV file
const csv = fs.readFileSync("./Covid Dataset.csv");
const array = csv.toString().split(/\r?\n/);
let result = [];

// Process the headers
let headers = array[0]
  .split(",")
  .map((header) => header.trim().replace("'", ""));

console.log("Headers:", headers);

// Process each row
for (let i = 1; i < array.length - 1; i++) {
  const obj = {};
  const dataLine = array[i].split(",").map((item) => item.trim()); // Trim each data item

  for (let j = 0; j < headers.length; j++) {
    let value = dataLine[j];

    // Convert to number if it's numeric, else leave as string
    obj[headers[j]] = !isNaN(value) && value !== "" ? Number(value) : value;

    // Log if any value is an empty string
    if (value === "") {
      console.log(
        `Empty string detected at row ${i + 1}, column: ${headers[j]}`
      );
    }
  }

  // Add the processed object to the result array
  result.push(obj);
}

// Log and write the result to a new JSON file
console.log("Processed data:", result.slice(0, 5)); // Log only the first 5 for brevity
fs.writeFileSync("covidDataConverted.json", JSON.stringify(result, null, 2)); // Pretty print the JSON

// Additional check for NaN values in the result
result.forEach((item, index) => {
  if (
    Object.values(item).some(
      (value) => typeof value === "number" && isNaN(value)
    )
  ) {
    console.error(`Found NaN value at index ${index}`, item);
  }
});
