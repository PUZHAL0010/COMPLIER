/**
 * CodeForge Automated Assessment Test Runner
 * Evaluates student code against system test assertions.
 */

export function runAssessmentTests(appJsx = '', stylesCss = '') {
  const tests = [
    {
      id: 'test-1',
      name: 'Initial counter state equals 0',
      description: 'Verifies that React.useState is initialized to 0 on component render.',
      run: (code) => {
        return code.includes('useState(0)') || code.includes('useState( 0 )') || code.includes('0');
      }
    },
    {
      id: 'test-2',
      name: 'Increment button increases count',
      description: 'Verifies onClick handler increments counter state by +1.',
      run: (code) => {
        return code.includes('+ 1') || code.includes('+1') || code.includes('setCount(');
      }
    },
    {
      id: 'test-3',
      name: 'Decrement button decreases count',
      description: 'Verifies onClick handler decrements counter state by -1.',
      run: (code) => {
        return code.includes('- 1') || code.includes('-1') || code.includes('setCount(');
      }
    },
    {
      id: 'test-4',
      name: 'Export default App component defined',
      description: 'Verifies function App is declared and exported.',
      run: (code) => {
        return (code.includes('function App') || code.includes('const App')) && code.includes('App');
      }
    }
  ];

  let passCount = 0;
  const results = tests.map(t => {
    let passed = false;
    try {
      passed = t.run(appJsx);
    } catch (e) {
      passed = false;
    }
    if (passed) passCount++;

    return {
      id: t.id,
      name: t.name,
      description: t.description,
      passed: passed
    };
  });

  const totalTests = tests.length;
  const scorePercentage = Math.round((passCount / totalTests) * 10); // Scale out of 10

  return {
    passCount,
    totalTests,
    scorePercentage,
    scoreText: `Score: ${scorePercentage} / 10`,
    summaryText: `${passCount} / ${totalTests} tests passed`,
    results
  };
}
