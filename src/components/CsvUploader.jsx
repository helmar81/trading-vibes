
import React, { useState } from 'react';
import Papa from 'papaparse';
import TradeAnalysis from './TradeAnalysis.jsx';

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
    setError('');

    const reader = new FileReader();

    reader.onload = ({ target }) => {
      Papa.parse(target.result, {
        header: true,
        dynamicTyping: true,
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
          if (!data.some(row => 'profit' in row) || !data.some(row => 'points' in row)) {
            setError("CSV must contain 'profit' and 'points' columns.");
            setTradeProfits(null);
            setTradePoints(null);
            return;
          }

          const profits = data.map(row => row.profit).filter(value => typeof value === 'number' && !isNaN(value));
          const points = data.map(row => row.points).filter(value => typeof value === 'number' && !isNaN(value));

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
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-purple-100 p-6 sm:p-8 rounded-lg shadow-inner border border-purple-300 mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-4">Upload Your Orders CSV</h2>
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
        {fileName && <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-medium break-words">{fileName}</span></p>}
        {isLoading && <p className="mt-2 text-sm text-blue-600">Loading and parsing data...</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {tradeProfits !== null && tradePoints !== null && (
        <TradeAnalysis tradeProfits={tradeProfits} tradePoints={tradePoints} />
      )}

      {(tradeProfits === null && tradePoints === null && !error && !isLoading) && (
        <TradeAnalysis tradeProfits={null} tradePoints={null} />
      )}
    </div>
  );
};

export default CsvUploader;
