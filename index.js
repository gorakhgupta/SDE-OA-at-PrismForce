// To Read & Write in the filesystem
const fs = require('fs');

// To calculate the Balance data over revenue & expense Data.
function calculateBalanceSheet(expenseData, revenueData) {
    // Object to store all unique {key: value} as Date : TotalAmount
  const balanceSheet = {};

  // Process expense data
  expenseData.forEach(expense => {
    const date = expense.startDate.slice(0, 7); // Extract year and month  (e.g., '2020-05') as Date is common in all

    if (!balanceSheet[date]) {
      balanceSheet[date] = 0;
    }
    //  Subtracting the expense amount  
    balanceSheet[date] -= expense.amount;
  });

  // Process revenue data
  revenueData.forEach(revenue => {
    const date = revenue.startDate.slice(0, 10); // Extract year and month (e.g., '2020-03') as Date is common in all

    if (!balanceSheet[date]) {
      balanceSheet[date] = 0;
    }
    // Adding the revenue amount
    balanceSheet[date] += revenue.amount;
  });

  // Generating missing dates in the balance sheet

  // Taking initial full date   
  const start = new Date(Math.min(...Object.keys(balanceSheet).map(date => new Date(date))));
 // Taking final full date 
  const end = new Date(Math.max(...Object.keys(balanceSheet).map(date => new Date(date))));
// assign start to current date 
  const currentDate = new Date(start);
//    Run a loop till currentDate is less than or equal to endDate
  while (currentDate <= end) {
    const date = currentDate.toISOString().slice(0, 7); // Extract year and month (e.g., '2020-05')

    if (!balanceSheet[date]) {
      balanceSheet[date] = 0;
    }
    //  assing next month date to current date
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Convert balance sheet object into an array of balances
  const balanceSheetArray = Object.entries(balanceSheet).map(([startDate, amount]) => ({
    amount,
    startDate: startDate + '-01T00:00:00.000Z', // Append day and time to the start date
  }));

  // Sort the balance sheet array in ascending order by start date
  balanceSheetArray.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1);

  return balanceSheetArray;
}

// Read the input JSON file
fs.readFile('2-input.json', 'utf8', (err, jsonString) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const data = JSON.parse(jsonString);
    const expenseData = data.expenseData || [];
    const revenueData = data.revenueData || [];

    // Calculate the balance sheet
    const balanceSheet = calculateBalanceSheet(expenseData, revenueData);

    // Create the output object
    const outputData = {
      balance: balanceSheet
    };

    // Convert the output object to JSON string
    const outputJson = JSON.stringify(outputData, null, 2);

    // Output the result to the console
    console.log(outputJson);

    // Write the output JSON file
    fs.writeFile('test-2-output.json', outputJson, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Output file created: output.json');
    });
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});
