import React from 'react';
import ReactDOM from 'react-dom';

const TestApp = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Test App is Working!</h1>
      <p>React Native Web is loading correctly.</p>
    </div>
  );
};

ReactDOM.render(<TestApp />, document.getElementById('root'));