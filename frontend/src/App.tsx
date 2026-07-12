import './App.css'

/**
 * Main React component for the student CI/CD application.
 *
 * A React component is a function that returns TSX.
 * TSX looks similar to HTML but is written inside TypeScript.
 */
function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="label">FULL-STACK CI/CD LEARNING PROJECT</p>

        <h1>React frontend is working</h1>

        <p className="description">
          This frontend will communicate with our FastAPI backend.
          GitHub Actions will test both applications before changes
          are allowed into the main branch.
        </p>

        <div className="status-card">
          <span className="status-indicator" aria-hidden="true" />

          <div>
            <h2>Frontend status</h2>
            <p>React development server is running successfully.</p>
          </div>
        </div>

        <div className="technology-list">
          <span>React</span>
          <span>TypeScript</span>
          <span>FastAPI</span>
          <span>Docker</span>
          <span>GitHub Actions</span>
        </div>
      </section>
    </main>
  )
}

export default App