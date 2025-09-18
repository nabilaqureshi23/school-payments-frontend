import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL||"http://localhost:3000";

function ModernTransactionsOverview() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState({ key: "payment_time", direction: "desc" });

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // UI States
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data.data || []);
      } catch {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Apply filters, search, sort
  useEffect(() => {
    let filtered = [...transactions];

    if (statusFilter.length > 0) {
      filtered = filtered.filter((t) => statusFilter.includes(t.status.toLowerCase()));
    }

    if (schoolFilter.length > 0) {
      filtered = filtered.filter((t) => schoolFilter.includes(t.order?.school_id));
    }

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        Object.values(t).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (dateRange.from) {
      filtered = filtered.filter((t) => new Date(t.payment_time) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      filtered = filtered.filter((t) => new Date(t.payment_time) <= new Date(dateRange.to));
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key] || "";
        const valB = b[sortConfig.key] || "";
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
    setPage(1);
  }, [transactions, statusFilter, schoolFilter, searchQuery, dateRange, sortConfig]);

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredTransactions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredTransactions.length / limit);

  // Helper functions
  const toggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const toggleSchool = (schoolId) => {
    setSchoolFilter((prev) =>
      prev.includes(schoolId) ? prev.filter((s) => s !== schoolId) : [...prev, schoolId]
    );
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const uniqueSchools = [...new Set(transactions.map((t) => t.order?.school_id).filter(Boolean))];

  const refreshData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(data.data || []);
    } catch {
      setError("Failed to refresh transactions");
    } finally {
      setLoading(false);
    }
  };

  // Inline styles for better compatibility
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '24px'
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      marginTop: '4px',
      margin: 0
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.15s ease'
    },
    primaryButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: '1px solid #2563eb'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    statCardContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      margin: '0 0 4px 0'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    statIcon: {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px'
    },
    mainCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    cardHeader: {
      padding: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    cardHeaderTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: 0
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '16px',
      marginRight:'50px'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    filtersContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    filterLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    filterOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '96px',
      overflowY: 'auto'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#6b7280',
      cursor: 'pointer'
    },
    checkbox: {
      marginRight: '8px'
    },
    dateInput: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      outline: 'none'
    },
    tableContainer: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    th: {
      padding: '16px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      cursor: 'pointer',
      userSelect: 'none'
    },
    td: {
      padding: '16px 24px',
      borderBottom: '1px solid #f3f4f6',
      fontSize: '14px',
      color: '#111827'
    },
    tableRow: {
      transition: 'background-color 0.15s ease'
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '16px',
      border: '1px solid'
    },
    gatewayBadge: {
      padding: '4px 12px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '16px'
    },
    pagination: {
      padding: '16px 24px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    paginationInfo: {
      fontSize: '14px',
      color: '#6b7280'
    },
    paginationControls: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    pageButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease'
    },
    pageButtonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    pageInfo: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      color: '#6b7280'
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      color: '#dc2626'
    },
    noData: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      color: '#6b7280'
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return { ...styles.statusBadge, backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' };
      case "pending":
        return { ...styles.statusBadge, backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
      case "failed":
        return { ...styles.statusBadge, backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
      default:
        return { ...styles.statusBadge, backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#d1d5db' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "success": return "✓";
      case "pending": return "⏳";
      case "failed": return "✕";
      default: return "•";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.title}>Transactions</h1>
              <p style={styles.subtitle}>Manage and monitor all payment transactions</p>
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={refreshData}
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statLabel}>Total Transactions</p>
                <p style={styles.statValue}>{transactions.length}</p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#dbeafe', color: '#2563eb' }}>
                📊
              </div>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statLabel}>Successful</p>
                <p style={{ ...styles.statValue, color: '#059669' }}>
                  {transactions.filter(t => t.status?.toLowerCase() === 'success').length}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#d1fae5', color: '#059669' }}>
                ✓
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statLabel}>Pending</p>
                <p style={{ ...styles.statValue, color: '#d97706' }}>
                  {transactions.filter(t => t.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#fef3c7', color: '#d97706' }}>
                ⏳
              </div>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardContent}>
              <div>
                <p style={styles.statLabel}>Failed</p>
                <p style={{ ...styles.statValue, color: '#dc2626' }}>
                  {transactions.filter(t => t.status?.toLowerCase() === 'failed').length}
                </p>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: '#fee2e2', color: '#dc2626' }}>
                ✕
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div style={styles.mainCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderTop}>
              <h2 style={styles.cardTitle}>Transaction Data</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={styles.button}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              >
                <Filter size={16} />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
              <Search size={16} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div style={styles.filtersContainer}>
                {/* Status Filter */}
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Status</label>
                  <div style={styles.filterOptions}>
                    {['success', 'pending', 'failed'].map(status => (
                      <label key={status} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={() => toggleStatus(status)}
                          style={styles.checkbox}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* School Filter */}
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>School</label>
                  <div style={styles.filterOptions}>
                    {uniqueSchools.map(schoolId => (
                      <label key={schoolId} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={schoolFilter.includes(schoolId)}
                          onChange={() => toggleSchool(schoolId)}
                          style={styles.checkbox}
                        />
                        {schoolId}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    style={styles.dateInput}
                  />
                </div>

                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    style={styles.dateInput}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={styles.tableContainer}>
            {loading ? (
              <div style={styles.loading}>
                <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
                Loading transactions...
              </div>
            ) : error ? (
              <div style={styles.error}>{error}</div>
            ) : paginatedData.length === 0 ? (
              <div style={styles.noData}>No transactions found</div>
            ) : (
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    {[
                      { key: "collect_id", label: "Transaction ID" },
                      { key: "school_id", label: "School" },
                      { key: "gateway_name", label: "Gateway" },
                      { key: "order_amount", label: "Order Amount" },
                      { key: "transaction_amount", label: "Transaction Amount" },
                      { key: "status", label: "Status" },
                      { key: "custom_order_id", label: "Custom Order ID" },
                      { key: "payment_time", label: "Payment Time" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        style={styles.th}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {col.label}
                          {sortConfig.key === col.key && (
                            sortConfig.direction === "asc" ? 
                            <ChevronUp size={16} /> : 
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((transaction) => (
                    <tr 
                      key={transaction.collect_id} 
                      style={styles.tableRow}
                      onMouseOver={(e) => {
                        const row = e.currentTarget;
                        row.style.backgroundColor = '#ffffff';
                        row.style.transform = 'translateY(-4px) translateX(-8px) scale(1.02)';
                        row.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                        row.style.zIndex = '20';
                        row.style.position = 'relative';
                        row.style.borderRadius = '8px';
                        row.style.width = 'calc(100% + 16px)';
                      }}
                      onMouseOut={(e) => {
                        const row = e.currentTarget;
                        row.style.backgroundColor = 'white';
                        row.style.transform = 'translateY(0) translateX(0) scale(1)';
                        row.style.boxShadow = 'none';
                        row.style.zIndex = '1';
                        row.style.position = 'static';
                        row.style.borderRadius = '0';
                        row.style.width = '100%';
                      }}
                    >
                      <td style={{ ...styles.td, fontWeight: '500' }}>
                        {transaction.collect_id}
                      </td>
                      <td style={styles.td}>
                        {transaction.order?.school_id || "-"}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.gatewayBadge}>
                          {transaction.order?.gateway_name}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: '500' }}>
                        {formatCurrency(transaction.order_amount)}
                      </td>
                      <td style={{ ...styles.td, fontWeight: '500' }}>
                        {formatCurrency(transaction.transaction_amount)}
                      </td>
                      <td style={styles.td}>
                        <span style={getStatusStyle(transaction.status)}>
                          <span style={{ marginRight: '4px' }}>{getStatusIcon(transaction.status)}</span>
                          {transaction.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {transaction.order?.custom_order_id || "-"}
                      </td>
                      <td style={styles.td}>
                        {formatDate(transaction.payment_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <div style={styles.paginationInfo}>
                Showing {startIndex + 1} to {Math.min(startIndex + limit, filteredTransactions.length)} of{' '}
                {filteredTransactions.length} results
              </div>
              <div style={styles.paginationControls}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  style={{
                    ...styles.pageButton,
                    ...(page === 1 ? styles.pageButtonDisabled : {})
                  }}
                  onMouseOver={(e) => {
                    if (page !== 1) e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    if (page !== 1) e.target.style.backgroundColor = 'white';
                  }}
                >
                  Previous
                </button>
                <span style={styles.pageInfo}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  style={{
                    ...styles.pageButton,
                    ...(page === totalPages ? styles.pageButtonDisabled : {})
                  }}
                  onMouseOver={(e) => {
                    if (page !== totalPages) e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseOut={(e) => {
                    if (page !== totalPages) e.target.style.backgroundColor = 'white';
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModernTransactionsOverview;