// src/pages/SchoolTransactions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL||"http://localhost:3000";

function SchoolTransactions() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState({ key: "payment_time", direction: "desc" });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0
  });

  // Fetch all schools from /transactions
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const uniqueSchools = [...new Set(res.data.data.map((t) => t.order?.school_id))];
        setSchools(uniqueSchools);
      } catch (err) {
        setError("Failed to load schools");
        console.error("Error fetching schools:", err);
      }
    };
    fetchSchools();
  }, []);

  // Calculate statistics
  useEffect(() => {
    const total = transactions.length;
    const successful = transactions.filter(t => t.status && t.status.toLowerCase() === 'success').length;
    const pending = transactions.filter(t => t.status && t.status.toLowerCase() === 'pending').length;
    const failed = transactions.filter(t => t.status && t.status.toLowerCase() === 'failed').length;

    setStats({ total, successful, pending, failed });
  }, [transactions]);

  // Fetch transactions by school
  const fetchTransactions = async (schoolId) => {
    if (!schoolId) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/transactions/school/${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.data || []);
      setPage(1);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters, search, sort
  useEffect(() => {
    let filtered = [...transactions];

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter((t) => t.status && statusFilter.includes(t.status.toLowerCase()));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          (t.collect_id && t.collect_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (t.custom_order_id && t.custom_order_id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Date filter
    if (dateRange.from) {
      filtered = filtered.filter((t) => t.payment_time && new Date(t.payment_time) >= new Date(dateRange.from));
    }
    if (dateRange.to) {
      filtered = filtered.filter((t) => t.payment_time && new Date(t.payment_time) <= new Date(dateRange.to));
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key] || "";
        let valB = b[sortConfig.key] || "";
        
        if (sortConfig.key === "order_amount" || sortConfig.key === "transaction_amount") {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        }
        
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, statusFilter, searchQuery, dateRange, sortConfig]);

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedData = filteredTransactions.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredTransactions.length / limit);

  // Toggle status filters
  const toggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Export functionality
  const handleExport = () => {
    console.log("Export functionality - transactions:", filteredTransactions);
    alert("Export functionality will be implemented here");
  };

  // Refresh data
  const handleRefresh = () => {
    if (selectedSchool) {
      fetchTransactions(selectedSchool);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return {
      style: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        border: 'none',
        display: 'inline-block'
      },
      text: 'Unknown'
    };
    
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'success':
        return {
          style: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#dcfce7',
            color: '#166534',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          },
          text: status,
          icon: '✓'
        };
      case 'pending':
        return {
          style: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          },
          text: status,
          icon: '⏳'
        };
      case 'failed':
        return {
          style: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          },
          text: status,
          icon: '✕'
        };
      case 'initiated':
        return {
          style: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#e0e7ff',
            color: '#3730a3',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          },
          text: status,
          icon: '•'
        };
      default:
        return {
          style: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            border: 'none',
            display: 'inline-block'
          },
          text: status
        };
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Transactions</h1>
            <p style={{ color: '#6b7280', marginTop: '4px', margin: 0 }}>Manage and monitor all payment transactions</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleRefresh}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📥 Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Total Transactions</p>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{stats.total}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                📊
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Successful</p>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#059669', margin: 0 }}>{stats.successful}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#d1fae5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ✅
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Pending</p>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#d97706', margin: 0 }}>{stats.pending}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⏳
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px 0' }}>Failed</p>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>{stats.failed}</p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fee2e2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ❌
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Data Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>Transaction Data</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                🔍 Filters {showFilters ? '▲' : '▼'}
              </button>
            </div>

            {/* School Selection */}
            <div style={{ marginBottom: '24px' }}>
              <select
                value={selectedSchool}
                onChange={(e) => {
                  setSelectedSchool(e.target.value);
                  fetchTransactions(e.target.value);
                }}
                style={{
                  width: '300px',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: selectedSchool ? '#111827' : '#9ca3af'
                }}
              >
                <option value="" disabled>Select school</option>
                {schools.map((id) => (
                  <option key={id} value={id} style={{ color: '#111827' }}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            {showFilters && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px'
              }}>
                {/* Search */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Search Transactions
                  </label>
                  <input
                    type="text"
                    placeholder="Search by ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Status Filters */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Status
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['success', 'pending', 'failed'].map((status) => (
                      <label key={status} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={() => toggleStatus(status)}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                <div>⏳ Loading...</div>
              </div>
            ) : error ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                <p style={{ color: '#dc2626' }}>{error}</p>
              </div>
            ) : paginatedData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                <p style={{ color: '#6b7280' }}>
                  {selectedSchool ? 'No transactions found' : 'Please select a school to view transactions'}
                </p>
              </div>
            ) : (
              <table style={{ minWidth: '100%', width: '100%' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    {[
                      { key: "collect_id", label: "Transaction ID" },
                      { key: "school_id", label: "School" },
                      { key: "gateway", label: "Gateway" },
                      { key: "order_amount", label: "Order Amount" },
                      { key: "transaction_amount", label: "Transaction Amount" },
                      { key: "status", label: "Status" },
                      { key: "custom_order_id", label: "Custom Order ID" },
                      { key: "payment_time", label: "Payment Time" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        style={{
                          padding: '12px 24px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          borderBottom: '1px solid #e5e7eb'
                        }}
                      >
                        {col.label} {sortConfig.key === col.key && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: 'white' }}>
                  {paginatedData.map((t, index) => (
                    <tr key={t.collect_id || index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {t.collect_id || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {t.order?.school_id || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {t.order?.gateway_name || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                        ₹{t.order_amount || 0}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                        ₹{t.transaction_amount || 0}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                        {(() => {
                          const statusBadge = getStatusBadge(t.status);
                          return (
                            <span style={statusBadge.style}>
                              {statusBadge.icon && <span>{statusBadge.icon}</span>}
                              {statusBadge.text}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {t.order?.custom_order_id || '-'}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>
                        {t.payment_time ? new Date(t.payment_time).toLocaleString("en-IN") : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {paginatedData.length > 0 && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '14px', color: '#374151' }}>
                Showing {startIndex + 1} to {Math.min(startIndex + limit, filteredTransactions.length)} of{' '}
                {filteredTransactions.length} results
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: page === 1 ? '#9ca3af' : '#374151',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Previous
                </button>
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: page === totalPages ? '#9ca3af' : '#374151',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer'
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

export default SchoolTransactions;