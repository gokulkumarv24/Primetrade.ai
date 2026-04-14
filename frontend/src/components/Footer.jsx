function Footer() {
  return (
    <div
      style={{
        background: '#1e293b',
        color: '#94a3b8',
        padding: '24px',
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '14px',
      }}
    >
      <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '16px' }}>
        TaskFlow - Project Links
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        <a
          href="https://primetrade-ai-46qy.onrender.com/api-docs/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid #60a5fa',
            borderRadius: '6px',
          }}
        >
          📄 API Docs (Swagger)
        </a>
        <a
          href="https://github.com/gokulkumarv24/Primetrade.ai.git"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid #60a5fa',
            borderRadius: '6px',
          }}
        >
          💻 GitHub Repository
        </a>
        <a
          href="https://primetrade-ai-46qy.onrender.com/api/v1/health"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid #60a5fa',
            borderRadius: '6px',
          }}
        >
          🔗 Backend API
        </a>
      </div>
      <p style={{ marginTop: '16px', fontSize: '12px' }}>
        Built with Node.js, Express, MongoDB, React &amp; JWT Authentication
      </p>
    </div>
  );
}

export default Footer;
