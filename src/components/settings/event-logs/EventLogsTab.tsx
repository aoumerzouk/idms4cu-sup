import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface EventLog {
  timestamp: string;
  level: string;
  message: string;
  endpoint?: string;
  retryCount?: number;
  lastAttempt?: string;
  error?: any;
}

export default function EventLogsTab() {
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'get_logs',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLogs(data.logs);
      } catch (err) {
        console.error('API connection failed', err);
        setError('Failed to load event logs. Please check your API connection.');
        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            level: 'error',
            message: 'API connection failed',
            error: err instanceof Error ? { message: err.message, stack: err.stack } : err
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading event logs...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(log.timestamp), 'MM/dd/yyyy, h:mm:ss a')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.level}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {log.message}
                {log.endpoint && (
                  <div className="text-xs text-gray-400">
                    Endpoint: {log.endpoint}
                  </div>
                )}
                {log.retryCount && (
                  <div className="text-xs text-gray-400">
                    Retry Count: {log.retryCount}
                  </div>
                )}
                {log.lastAttempt && (
                  <div className="text-xs text-gray-400">
                    Last Attempt: {format(new Date(log.lastAttempt), 'MM/dd/yyyy, h:mm:ss a')}
                  </div>
                )}
                {log.error && (
                  <div className="text-xs text-red-500">
                    Error: {log.error.message}
                    {log.error.stack && (
                      <pre className="text-xs text-red-500 whitespace-pre-wrap">
                        {log.error.stack}
                      </pre>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
