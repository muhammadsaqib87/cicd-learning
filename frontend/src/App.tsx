import { useEffect, useState } from 'react'
import './App.css'


/**
 * The JSON structure returned by GET /health.
 */
type HealthResponse = {
  status: string
}


/**
 * The JSON structure returned by GET /version.
 */
type VersionResponse = {
  version: string
}


/**
 * Address of our local FastAPI backend.
 *
 * Later, this can come from a Vite environment variable when
 * the backend is deployed to a public server.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'


/**
 * Main React component.
 *
 * When the component starts, it requests:
 * - GET /health
 * - GET /version
 *
 * It then displays the returned backend information.
 */
function App() {
  // Store the backend health value.
  const [backendStatus, setBackendStatus] = useState('checking')

  // Store the backend version.
  const [backendVersion, setBackendVersion] = useState('unknown')

  // Store a readable error when the backend cannot be reached.
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  useEffect(() => {
    /**
     * AbortController lets React cancel unfinished requests when
     * the component is removed from the page.
     */
    const controller = new AbortController()


    async function loadBackendInformation() {
      try {
        setErrorMessage(null)

        // Request health and version information at the same time.
        const [healthResponse, versionResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/health`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE_URL}/version`, {
            signal: controller.signal,
          }),
        ])

        // fetch() does not automatically throw an error for HTTP
        // responses such as 404 or 500, so we check response.ok.
        if (!healthResponse.ok) {
          throw new Error(
            `Health request failed with HTTP ${healthResponse.status}`,
          )
        }

        if (!versionResponse.ok) {
          throw new Error(
            `Version request failed with HTTP ${versionResponse.status}`,
          )
        }

        // Convert both JSON response bodies into TypeScript objects.
        const healthData =
          (await healthResponse.json()) as HealthResponse

        const versionData =
          (await versionResponse.json()) as VersionResponse

        // Update the page with data returned by FastAPI.
        setBackendStatus(healthData.status)
        setBackendVersion(versionData.version)
      } catch (error) {
        // Ignore cancellation errors caused by component cleanup.
        if (
          error instanceof DOMException
          && error.name === 'AbortError'
        ) {
          return
        }

        setBackendStatus('unavailable')

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'An unknown connection error occurred',
        )
      }
    }


    void loadBackendInformation()


    // Cancel unfinished requests during component cleanup.
    return () => {
      controller.abort()
    }
  }, [])


  const backendIsHealthy =
    backendStatus === 'ok' && errorMessage === null


  return (
    <main className="page">
      <section className="hero">
        <p className="label">
          FULL-STACK CI/CD LEARNING PROJECT
        </p>

        <h1>React and FastAPI are connected</h1>

        <p className="description">
          React is requesting live health and version information
          from the FastAPI backend.
        </p>

        <div
          className={
            backendIsHealthy
              ? 'status-card'
              : 'status-card status-card--error'
          }
        >
          <span
            className={
              backendIsHealthy
                ? 'status-indicator'
                : 'status-indicator status-indicator--error'
            }
            aria-hidden="true"
          />

          <div>
            <h2>Backend connection</h2>

            {backendStatus === 'checking' && (
              <p>Checking the FastAPI backend...</p>
            )}

            {backendIsHealthy && (
              <p>FastAPI is connected and responding correctly.</p>
            )}

            {errorMessage && (
              <p>
                FastAPI connection failed: {errorMessage}
              </p>
            )}
          </div>
        </div>

        <dl className="backend-details">
          <div>
            <dt>Backend status</dt>
            <dd>{backendStatus}</dd>
          </div>

          <div>
            <dt>Backend version</dt>
            <dd>{backendVersion}</dd>
          </div>

          <div>
            <dt>API address</dt>
            <dd>{API_BASE_URL}</dd>
          </div>
        </dl>

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