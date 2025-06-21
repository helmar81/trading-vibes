import React, { useState } from 'react';
import Papa from 'papaparse';
import TradeAnalysis from './TradeAnalysis.jsx'; // Import the TradeAnalysis component

const CsvUploader = () => {
  const [tradeProfits, setTradeProfits] = useState(null);
  const [tradePoints, setTradePoints] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }
    if (file.type !== 'text/csv') {
      setError('Invalid file type. Please upload a CSV file.');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setError(''); // Clear previous errors

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      Papa.parse(target.result, {
        header: true,      // Treat the first row as headers
        dynamicTyping: true, // Attempt to convert numbers and booleans
        skipEmptyLines: true,
        complete: (results) => {
          setIsLoading(false);
          if (results.errors.length) {
            setError(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`);
            setTradeProfits(null);
            setTradePoints(null);
            return;
          }

          const data = results.data;

          // Check if 'profit' and 'points' columns exist
          if (!data.some(row => 'profit' in row) || !data.some(row => 'points' in row)) {
            setError("CSV must contain 'profit' and 'points' columns.");
            setTradeProfits(null);
            setTradePoints(null);
            return;
          }

          const profits = data
            .map(row => row.profit)
            .filter(value => typeof value === 'number' && !isNaN(value)); // Ensure it's a number

          const points = data
            .map(row => row.points)
            .filter(value => typeof value === 'number' && !isNaN(value)); // Ensure it's a number

          if (profits.length === 0 || points.length === 0) {
            setError("No valid 'profit' or 'points' data found after parsing.");
            setTradeProfits(null);
            setTradePoints(null);
            return;
          }

          setTradeProfits(profits);
          setTradePoints(points);
        },
        error: (err) => {
          setIsLoading(false);
          setError(`Error parsing CSV: ${err.message}`);
          setTradeProfits(null);
          setTradePoints(null);
        }
      });
    };

    reader.onerror = () => {
      setIsLoading(false);
      setError('Failed to read file.');
      setTradeProfits(null);
      setTradePoints(null);
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-full">
      <div className="bg-purple-100 p-6 rounded-lg shadow-inner border border-purple-300 mb-8 text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Upload Your Orders CSV</h2>
        <input
          type="file"
          id="csv-upload"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100 cursor-pointer"
        />
        {fileName && <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-medium">{fileName}</span></p>}
        {isLoading && <p className="mt-2 text-sm text-blue-600">Loading and parsing data...</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Render TradeAnalysis only if data is loaded or if we are showing the initial state */}
      {tradeProfits !== null && tradePoints !== null && (
        <TradeAnalysis tradeProfits={tradeProfits} tradePoints={tradePoints} />
      )}
      {/* If no file uploaded yet, or error, TradeAnalysis will show its 'upload prompt' */}
      {(tradeProfits === null && tradePoints === null && !error && !isLoading) && (
           <TradeAnalysis tradeProfits={null} tradePoints={null} />
      )}
    </div>
  );
};

export default CsvUploader;
