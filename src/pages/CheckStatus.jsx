import React, { useState } from "react";
import axios from "axios";

const CheckStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!orderId.trim()) return;
    try {
      setError("");
      setStatus(null);
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/transaction-status/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setStatus(res.data.status);
      } else {
        setError("Transaction not found");
      }
    } catch (err) {
      setError("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusText) => {
    if (!statusText) return "#6B7280";
    switch (statusText.toLowerCase()) {
      case "success":
        return "#10B981";
      case "pending":
      case "initiated":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (statusText) => {
    if (!statusText) return "❓";
    switch (statusText.toLowerCase()) {
      case "success":
        return "✓";
      case "pending":
      case "initiated":
        return "⏳";
      case "failed":
        return "✗";
      default:
        return "❓";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Transaction Status</h1>
          <p style={styles.subtitle}>Check and monitor transaction status</p>
        </div>
      </div>

      <div style={styles.searchCard}>
        <div style={styles.searchContainer}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter custom_order_id or collect_id"
              style={styles.searchInput}
              onKeyPress={(e) => e.key === 'Enter' && checkStatus()}
            />
            <button
              onClick={checkStatus}
              disabled={loading}
              style={{
                ...styles.searchButton,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <div style={styles.errorText}>{error}</div>
        </div>
      )}

      {status && (
        <div style={styles.resultContainer}>
          <div style={styles.statusHeader}>
            <h2 style={styles.statusTitle}>Transaction Details</h2>
            <div style={{
              ...styles.statusBadge,
              backgroundColor: getStatusColor(status.status) + '15',
              color: getStatusColor(status.status),
              border: `1px solid ${getStatusColor(status.status)}30`
            }}>
              <span style={styles.statusIcon}>{getStatusIcon(status.status)}</span>
              {status.status || "Unknown"}
            </div>
          </div>

          <div style={styles.detailsGrid}>
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div style={styles.detailIcon}>🔍</div>
                <div style={styles.detailLabel}>Transaction ID</div>
              </div>
              <div style={styles.detailValue}>{status.collect_id}</div>
            </div>

            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div style={styles.detailIcon}>💰</div>
                <div style={styles.detailLabel}>Order Amount</div>
              </div>
              <div style={styles.detailValue}>₹{status.order_amount}</div>
            </div>

            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div style={styles.detailIcon}>🏛️</div>
                <div style={styles.detailLabel}>Gateway</div>
              </div>
              <div style={styles.detailValue}>{status.order?.gateway_name || "-"}</div>
            </div>

            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div style={styles.detailIcon}>⏰</div>
                <div style={styles.detailLabel}>Payment Time</div>
              </div>
              <div style={styles.detailValue}>
                {status.payment_time
                  ? new Date(status.payment_time).toLocaleString("en-IN")
                  : "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: 0
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB',
    marginBottom: '24px'
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'stretch'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#FFFFFF'
  },
  searchButton: {
    padding: '12px 24px',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '140px'
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  errorIcon: {
    fontSize: '20px'
  },
  errorText: {
    color: '#DC2626',
    fontSize: '16px',
    fontWeight: '500'
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E5E7EB'
  },
  statusHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB'
  },
  statusTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  statusIcon: {
    fontSize: '16px'
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  detailCard: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  detailIcon: {
    fontSize: '18px'
  },
  detailLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  detailValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    wordBreak: 'break-all'
  }
};

export default CheckStatus;