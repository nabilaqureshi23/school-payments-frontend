import React, { useEffect, useMemo, useState } from "react";

/**
 * Props:
 * - data: array of transactions
 * - schools: array of { id, name } for the school filter
 * - pageSize (default 10)
 * - onRowClick (optional)
 */
export default function TransactionTable({
  data = [],
  schools = [],
  pageSize = 10,
  onRowClick,
  persistKey = "txFilters" // localStorage key for filters (optional)
}) {
  // filters & controls (persist to localStorage and URL is handled by parent)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState([]); // ['success','pending','failed']
  const [schoolFilter, setSchoolFilter] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState("payment_time");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  // try load persisted filters (optional)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(persistKey);
      if (saved) {
        const s = JSON.parse(saved);
        setSearch(s.search || "");
        setStatusFilter(s.statusFilter || []);
        setSchoolFilter(s.schoolFilter || []);
        setDateFrom(s.dateFrom || "");
        setDateTo(s.dateTo || "");
        setSortField(s.sortField || "payment_time");
        setSortDir(s.sortDir || "desc");
      }
    } catch (e) {}
  }, [persistKey]);

  // persist changes
  useEffect(() => {
    const toSave = { search, statusFilter, schoolFilter, dateFrom, dateTo, sortField, sortDir };
    localStorage.setItem(persistKey, JSON.stringify(toSave));
  }, [search, statusFilter, schoolFilter, dateFrom, dateTo, sortField, sortDir, persistKey]);

  const filtered = useMemo(() => {
    let temp = [...data];

    if (search) {
      const q = search.toLowerCase();
      temp = temp.filter((t) =>
        Object.values(t).some((v) => String(v || "").toLowerCase().includes(q))
      );
    }

    if (statusFilter.length) {
      temp = temp.filter((t) => statusFilter.includes(String(t.status).toLowerCase()));
    }

    if (schoolFilter.length) {
      temp = temp.filter((t) => schoolFilter.includes(String(t.school_id)));
    }

    if (dateFrom) {
      const dFrom = new Date(dateFrom);
      temp = temp.filter((t) => new Date(t.payment_time) >= dFrom);
    }
    if (dateTo) {
      const dTo = new Date(dateTo);
      // include whole day
      dTo.setHours(23, 59, 59, 999);
      temp = temp.filter((t) => new Date(t.payment_time) <= dTo);
    }

    // sort
    temp.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === "payment_time") {
        const ad = new Date(aVal || 0).getTime();
        const bd = new Date(bVal || 0).getTime();
        return sortDir === "asc" ? ad - bd : bd - ad;
      }
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return temp;
  }, [data, search, statusFilter, schoolFilter, dateFrom, dateTo, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleStatus = (s) => {
    s = s.toLowerCase();
    setStatusFilter((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleSchool = (id) => {
    setSchoolFilter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const header = (key, label) => (
    <th
      className="px-3 py-2 text-left cursor-pointer select-none"
      onClick={() => {
        if (sortField === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else {
          setSortField(key);
          setSortDir("asc");
        }
      }}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {sortField === key && <span className="text-xs text-gray-500">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded border bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Status:</label>
          {["success", "pending", "failed"].map((s) => (
            <label key={s} className="inline-flex items-center gap-1">
              <input type="checkbox" checked={statusFilter.includes(s)} onChange={() => toggleStatus(s)} />
              <span className="capitalize text-sm">{s}</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Schools:</label>
          <div className="flex gap-2 overflow-x-auto">
            {schools.map((sch) => (
              <label key={sch.id} className="inline-flex items-center gap-1 whitespace-nowrap">
                <input type="checkbox" checked={schoolFilter.includes(sch.id)} onChange={() => toggleSchool(sch.id)} />
                <span className="text-sm">{sch.name || sch.id}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 flex items-center gap-3">
          <label className="text-sm">From:</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-2 py-1 rounded border" />
          <label className="text-sm">To:</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-2 py-1 rounded border" />
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => { setSearch(""); setStatusFilter([]); setSchoolFilter([]); setDateFrom(""); setDateTo(""); setSortField("payment_time"); setSortDir("desc"); }}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">Reset</button>
            <div className="text-sm text-gray-500">Results: {filtered.length}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {header("collect_id", "Transaction ID")}
              {header("school_id", "School")}
              {header("gateway", "Gateway")}
              {header("order_amount", "Order Amount")}
              {header("transaction_amount", "Transaction Amount")}
              {header("status", "Status")}
              {header("custom_order_id", "Custom Order ID")}
              {header("payment_time", "Payment Time")}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No transactions found</td></tr>
            )}
            {pageItems.map((t) => (
              <tr key={t.collect_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onRowClick?.(t)}>
                <td className="px-3 py-2 text-sm">{t.collect_id}</td>
                <td className="px-3 py-2 text-sm">{t.school_id}</td>
                <td className="px-3 py-2 text-sm">{t.gateway}</td>
                <td className="px-3 py-2 text-sm">₹{t.order_amount}</td>
                <td className="px-3 py-2 text-sm">₹{t.transaction_amount}</td>
                <td className="px-3 py-2 text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${String(t.status).toLowerCase() === "success" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : String(t.status).toLowerCase() === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm">{t.custom_order_id}</td>
                <td className="px-3 py-2 text-sm">{t.payment_time ? new Date(t.payment_time).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-3">
        <div>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100">Prev</button>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="ml-2 px-3 py-1 rounded bg-gray-100">Next</button>
        </div>
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
      </div>
    </div>
  );
}
