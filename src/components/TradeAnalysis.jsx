import React, { useState, useEffect } from 'react';

// This component now relies entirely on 'tradeProfits' and 'tradePoints' passed as props.
// It no longer contains internal sample data.

const App = ({ tradeProfits, tradePoints }) => {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [winLossRatio, setWinLossRatio] = useState(0);
  const [maxWin, setMaxWin] = useState(0);
  const [maxLoss, setMaxLoss] = useState(0);
  const [pointsData, setPointsData] = useState([]);
  const [pointsStats, setPointsStats] = useState({});

  useEffect(() => {
    // Ensure we have valid array data before proceeding
    const profitsToUse = Array.isArray(tradeProfits) ? tradeProfits : [];
    const pointsToUse = Array.isArray(tradePoints) ? tradePoints : [];

    // Perform calculations using profitsToUse
    const calculatedWins = profitsToUse.filter(p => p > 0).length;
    const calculatedLosses = profitsToUse.filter(p => p < 0).length;
    const calculatedWinLossRatio = calculatedLosses > 0 ? calculatedWins / calculatedLosses : (calculatedWins > 0 ? calculatedWins : 0);

    const positiveProfits = profitsToUse.filter(p => p > 0);
    const negativeProfits = profitsToUse.filter(p => p < 0);

    const calculatedMaxWin = positiveProfits.length > 0 ? Math.max(...positiveProfits) : 0;
    const calculatedMaxLoss = negativeProfits.length > 0 ? Math.min(...negativeProfits) : 0;

    setWins(calculatedWins);
    setLosses(calculatedLosses);
    setWinLossRatio(calculatedWinLossRatio);
    setMaxWin(calculatedMaxWin);
    setMaxLoss(calculatedMaxLoss);
    setPointsData(pointsToUse);

    // Calculate descriptive statistics for points
    if (pointsToUse.length > 0) {
      const sum = pointsToUse.reduce((a, b) => a + b, 0);
      const mean = sum / pointsToUse.length;
      const squaredDiffs = pointsToUse.map(x => (x - mean) ** 2);
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / pointsToUse.length;
      const stdDev = Math.sqrt(variance);
      const sortedPoints = [...pointsToUse].sort((a, b) => a - b);
      const min = sortedPoints[0];
      const max = sortedPoints[sortedPoints.length - 1];

      const getQuartile = (arr, q) => {
        const index = Math.floor(arr.length * q);
        return arr[index] !== undefined ? arr[index] : 0;
      };

      const q1 = getQuartile(sortedPoints, 0.25);
      const median = getQuartile(sortedPoints, 0.5);
      const q3 = getQuartile(sortedPoints, 0.75);


      setPointsStats({
        count: pointsToUse.length,
        mean: mean,
        std: stdDev,
        min: min,
        '25%': q1,
        '50%': median,
        '75%': q3,
        max: max
      });
    } else {
        setPointsStats({});
    }

  }, [tradeProfits, tradePoints]); // Effect re-runs when props change

  // Simple Bar Chart Component
  const BarChart = ({ data, title, barColors }) => {
    // Ensure data is an array and not empty to prevent errors
    if (!Array.isArray(data) || data.length === 0) {
        return <div className="text-center text-gray-500">No data available for chart.</div>;
    }

    const maxAbsValue = Math.max(...data.map(d => Math.abs(d.value)));
    const scaleFactor = maxAbsValue > 0 ? (maxAbsValue / 100) : 1;

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
        <div className="flex justify-around items-end h-40">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center mx-2">
              <div
                className="rounded-t-md w-12"
                style={{
                  height: `${Math.max(5, Math.abs(item.value) / scaleFactor)}px`, // Min height of 5px for visibility
                  backgroundColor: barColors[index % barColors.length],
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700 mt-2">{item.label}</span>
              <span className="text-xs text-gray-500">{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (tradeProfits === null || tradePoints === null) {
      return (
          <div className="flex justify-center items-center h-48">
              <div className="text-center text-gray-500 text-lg">
                 <h4> Upload your CSV file to view trade analysis.</h4>

               <p>
                 All processing happens locally in your browser.
               </p>
               <p>
                 No data is stored or sent to any server.
               </p>

              </div>
          </div>
      );
  }

  return (
    <div className="p-8 space-y-8">
        {/* Removed min-h-screen and some container styling as this will be nested */}
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
            Trade Performance Dashboard
        </h1>

        {/* Win/Loss Ratio Section */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-inner border border-purple-200">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Win/Loss Overview</h2>
            <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-4 md:space-y-0">
                <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
                    <p className="text-xl font-semibold text-gray-700">Total Wins</p>
                    <p className="text-3xl font-bold text-green-600">{wins}</p>
                </div>
                <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
                    <p className="text-xl font-semibold text-gray-700">Total Losses</p>
                    <p className="text-3xl font-bold text-red-600">{losses}</p>
                </div>
                <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
                    <p className="text-xl font-semibold text-gray-700">Win/Loss Ratio</p>
                    <p className="text-3xl font-bold text-blue-600">{winLossRatio.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <BarChart
                    data={[{ label: 'Wins', value: wins }, { label: 'Losses', value: losses }]}
                    title="Trade Wins vs. Losses"
                    barColors={['#34D399', '#EF4444']}
                />
            </div>
        </div>

        {/* Max Win/Loss Section */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Maximum Profit & Loss</h2>
            <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-4 md:space-y-0">
                <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
                    <p className="text-xl font-semibold text-gray-700">Maximum Win</p>
                    <p className="text-3xl font-bold text-green-600">${maxWin.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
                    <p className="text-xl font-semibold text-gray-700">Maximum Loss</p>
                    <p className="text-3xl font-bold text-red-600">${maxLoss.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <BarChart
                    data={[{ label: 'Max Win', value: maxWin }, { label: 'Max Loss', value: maxLoss }]}
                    title="Maximum Win vs. Maximum Loss"
                    barColors={['#10B981', '#DC2626']}
                />
            </div>
        </div>

        {/* Points Section */}
        <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Points Per Trade</h2>
            {pointsData.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-center max-h-60 overflow-y-auto p-2 rounded-md bg-white shadow-inner">
                        {pointsData.map((points, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    points > 0 ? 'bg-green-100 text-green-800' : (points < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800')
                                }`}
                            >
                                {points.toFixed(2)}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold text-green-700 mt-6 mb-3 text-center">Points Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-md shadow-inner">
                        {Object.entries(pointsStats).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                                <span className="font-semibold text-gray-700">{key.replace('%', ' Percent')}:</span>
                                <span className="text-gray-900 font-bold">{value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-500">No points data available to display.</div>

                
            )}
        </div>
    </div>
  );
};

export default App;
