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

    // Ensure all inputs are valid numbers before calculation
    if (!isNaN(H) && !isNaN(L) && !isNaN(C) && L !== 0 && C !== 0 && H !== 0) {
      // Calculate Pivot Point (PP)
      const calculatedPP = (H + L + C) / 3;

      // Calculate Long Trigger (R1) and Short Trigger (S1)
      // Long Trigger (R1) = (2 * PP) - L
      // Short Trigger (S1) = (2 * PP) - H
      const calculatedLongTrigger = (2 * calculatedPP) - L;
      const calculatedShortTrigger = (2 * calculatedPP) - H;

      setPivotPoint(calculatedPP);
      setLongTrigger(calculatedLongTrigger);
      setShortTrigger(calculatedShortTrigger);
    } else {
      // Reset values if inputs are invalid
      setPivotPoint(null);
      setLongTrigger(null);
      setShortTrigger(null);
    }
  }, [high, low, close]); // Recalculate whenever H, L, or C inputs change

  return (
    <div className="min-h-screen md:max-xl:flex sm:max-2xl bg-gradient-to-br from-purple-50 to-indigo-50 p-8 font-inter text-gray-900 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
          Daily Pivot Point Calculator
        </h1>

        <div className="bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">Enter Previous Day's Prices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label htmlFor="high" className="text-lg font-medium text-gray-700 mb-2">High (H)</label>
              <input
                type="number"
                id="high"
                value={high}
                onChange={(e) => setHigh(e.target.value)}
                placeholder="e.g., 6000.00"
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="low" className="text-lg font-medium text-gray-700 mb-2">Low (L)</label>
              <input
                type="number"
                id="low"
                value={low}
                onChange={(e) => setLow(e.target.value)}
                placeholder="e.g., 5950.00"
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="close" className="text-lg font-medium text-gray-700 mb-2">Close (C)</label>
              <input
                type="number"
                id="close"
                value={close}
                onChange={(e) => setClose(e.target.value)}
                placeholder="e.g., 5980.00"
                className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>
        </div>

        {pivotPoint !== null && (
          <div className="bg-white p-6 rounded-lg shadow-xl border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Calculated Levels</h2>
            <div className="space-y-4 text-center">
              <div className="p-4 bg-blue-50 rounded-md shadow-sm">
                <p className="text-xl font-semibold text-gray-700">Pivot Point (PP)</p>
                <p className="text-3xl font-bold text-blue-600">{pivotPoint.toFixed(2)}</p>
                <p className="text-sm text-gray-500">(H + L + C) / 3</p>
              </div>
              <div className="p-4 bg-green-50 rounded-md shadow-sm">
                <p className="text-xl font-semibold text-gray-700">Long Trigger (R1)</p>
                <p className="text-3xl font-bold text-green-600">{longTrigger.toFixed(2)}</p>
                <p className="text-sm text-gray-500">(2 * PP) - L</p>
              </div>
              <div className="p-4 bg-red-50 rounded-md shadow-sm">
                <p className="text-xl font-semibold text-gray-700">Short Trigger (S1)</p>
                <p className="text-3xl font-bold text-red-600">{shortTrigger.toFixed(2)}</p>
                <p className="text-sm text-gray-500">(2 * PP) - H</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions/Disclaimer */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-sm text-gray-600 mt-8 border border-gray-200">
          <p className="font-semibold mb-2">Usage Instructions:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>Enter the previous day's High, Low, and Close prices</li>
            <li>The calculator will automatically compute the pivot point and trigger levels</li>
            <li>Use Long Trigger (R1) for potential upward movement</li>
            <li>Use Short Trigger (S1) for potential downward movement</li>
          </ol>

           <div class="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-400">
        <a href="/analyze" class="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105">
         Upload Your Orders
        </a>
        <a href="/blog" class="border border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105">
          Read My Blog
        </a>
      </div>
        </div>
      </div>

      
    </div>
  );
};

export default PivotPointCalculator;