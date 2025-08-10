// Environment validation for frontend
const validateFrontendEnv = () => {
  const requiredVars = ['VITE_API_URL'];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('📄 Please check your .env file and ensure all required variables are set.');
    
    // Show user-friendly error in development
    if (import.meta.env.DEV) {
      document.body.innerHTML = `
        <div style="
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          font-family: system-ui; 
          background: #1f2937; 
          color: white; 
          text-align: center;
          padding: 20px;
        ">
          <div>
            <h1>⚠️ Configuration Error</h1>
            <p>Missing environment variables: <strong>${missing.join(', ')}</strong></p>
            <p>Please check your .env file in the frontend directory.</p>
            <code style="
              background: #374151; 
              padding: 10px; 
              border-radius: 5px; 
              display: block; 
              margin: 20px 0;
            ">VITE_API_URL=http://localhost:5000</code>
          </div>
        </div>
      `;
      return false;
    }
  }
  
  // Validate API URL format
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && !apiUrl.startsWith('http')) {
    console.warn('⚠️ VITE_API_URL should start with http:// or https://');
  }
  
  return true;
};

export default validateFrontendEnv;
