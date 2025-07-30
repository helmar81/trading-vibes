import React, { useState, useEffect } from 'react';

const PivotPointCalculator = () => {
  const [high, setHigh] = useState('');
  const [low, setLow] = useState('');
  const [close, setClose] = useState('');

  const [pivotPoint, setPivotPoint] = useState(null);
  const [longTrigger, setLongTrigger] = useState(null);
  const [shortTrigger, setShortTrigger] = useState(null);

  useEffect(() => {
    const H = parseFloat(high);
    const L = parseFloat(low);
    const C = parseFloat(close);

    if (!isNaN(H) && !isNaN(L) && !isNaN(C) && L !== 0 && C !== 0 && H !== 0) {
      const calculatedPP = (H + L + C) / 3;
      const calculatedLongTrigger = (2 * calculatedPP) - L;
      const calculatedShortTrigger = (2 * calculatedPP) - H;

      setPivotPoint(calculatedPP);
      setLongTrigger(calculatedLongTrigger);
      setShortTrigger(calculatedShortTrigger);
    } else {
      setPivotPoint(null);
      setLongTrigger(null);
      setShortTrigger(null);
    }
  }, [high, low, close]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-700">
        Daily Pivot Point Calculator
      </h1>

      <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg shadow-inner border border-indigo-200">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4 text-center">
          Enter Previous Day's Prices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['High (H)', 'Low (L)', 'Close (C)'].map((label, idx) => {
            const ids = ['high', 'low', 'close'];
            const setters = [setHigh, setLow, setClose];
            const values = [high, low, close];
            return (
              <div className="flex flex-col" key={idx}>
                <label htmlFor={ids[idx]} className="text-base font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="number"
                  id={ids[idx]}
                  value={values[idx]}
                  onChange={(e) => setters[idx](e.target.value)}
                  placeholder={`e.g., ${label === 'High (H)' ? '6000.00' : label === 'Low (L)' ? '5950.00' : '5980.00'}`}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                />
              </div>
            );
          })}
        </div>
      </div>

      {pivotPoint !== null && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl border border-blue-200">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 text-center">Calculated Levels</h2>
          <div className="space-y-4 text-center">
            {[
              { title: 'Pivot Point (PP)', value: pivotPoint, color: 'blue', formula: '(H + L + C) / 3' },
              { title: 'Long Trigger (R1)', value: longTrigger, color: 'green', formula: '(2 × PP) − L' },
              { title: 'Short Trigger (S1)', value: shortTrigger, color: 'red', formula: '(2 × PP) − H' },
            ].map(({ title, value, color, formula }, idx) => (
              <div key={idx} className={`p-4 bg-${color}-50 rounded-md shadow-sm`}>
                <p className="text-lg font-semibold text-gray-700">{title}</p>
                <p className={`text-2xl font-bold text-${color}-600`}>{value.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{formula}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-sm text-gray-700 mt-4 border border-gray-200">
        <p className="font-semibold mb-2">Usage Instructions:</p>
        <ol className="list-decimal list-inside ml-4 space-y-1">
          <li>Enter the previous day's High, Low, and Close prices</li>
          <li>The calculator will automatically compute the pivot point and trigger levels</li>
          <li>Use Long Trigger (R1) for potential upward movement</li>
          <li>Use Short Trigger (S1) for potential downward movement</li>
        </ol>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <a
            href="/analyze"
            className="w-full sm:w-auto text-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            Upload Your Orders
          </a>
          <a
            href="/blog"
            className="w-full sm:w-auto text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            Read My Blog
          </a>
        </div>
      </div>
    </div>
  );
};

export default PivotPointCalculator;
