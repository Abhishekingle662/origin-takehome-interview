'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

interface Session {
  id: number;
  therapistName: string;
  patientName: string;
  date: string;
  status: 'Scheduled' | 'Completed';
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Scheduled' | 'Completed'>('All');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/sessions');
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id: number) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      const updatedSession = await response.json();
      
      // Update local state with optimistic update
      setSessions(sessions.map(s => s.id === id ? updatedSession : s));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    'For kids & families',
    'Providers',
    'Learning center',
    'Send a referral',
  ];

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesSearch =
          session.therapistName.toLowerCase().includes(search.toLowerCase()) ||
          session.patientName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || session.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [sessions, search, statusFilter],
  );

  const highlightItems = useMemo(
    () => [
      {
        label: 'Therapy in the home',
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              d="M5 12l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: 'Start in less than 3 days',
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              d="M12 2v6m0 8v6m0-6l4 4m-4-4l-4 4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: 'Use your insurance',
        icon: (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <rect
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            <circle cx="8" cy="15" r="1" fill="currentColor" />
          </svg>
        ),
      },
    ],
    [],
  );
  const completedCount = sessions.filter((session) => session.status === 'Completed').length;
  const scheduledCount = sessions.filter((session) => session.status === 'Scheduled').length;
  const therapistCount = new Set(sessions.map((session) => session.therapistName)).size;
  const patientCount = new Set(sessions.map((session) => session.patientName)).size;

  return (
    <div className="min-h-screen bg-[#F7F4FB] text-slate-900">
      <header className="relative z-50 bg-[#FCF8F5] border-b border-purple-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Image
              className="rounded-full border border-purple-200 shadow-sm"
              src="/origin.png"
              width={48}
              height={48}
              alt="Origin"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-600">Origin</p>
              <p className="text-lg font-semibold text-slate-800">Therapy dashboard</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-purple-600"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 md:block">
              Schedule call
            </button>
            <button
              className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-slate-400 md:hidden"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                {isMobileNavOpen ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isMobileNavOpen && (
          <>
            <button
              className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
              aria-label="Close navigation overlay"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="fixed inset-x-4 top-[92px] z-50 rounded-3xl border border-purple-100 bg-[#FCF8F5] px-6 py-6 shadow-2xl md:hidden">
              <nav className="flex flex-col gap-3 text-sm font-medium text-slate-600">
                {navLinks.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="rounded-full px-4 py-2 transition hover:bg-white"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    {link}
                  </a>
                ))}
                <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Schedule call
                </button>
              </nav>
            </div>
          </>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <section className="grid gap-10 rounded-[32px] bg-[#E8F0FF] px-8 py-12 shadow-2xl shadow-purple-100 md:grid-cols-2">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-600">
              Serving Northern Virginia families
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#261C3F] sm:text-5xl">
              Speech therapy in the home — using your insurance
            </h1>
            <p className="text-lg text-slate-700">
              Expert therapists with no waitlist that collaborate closely with caregivers, track
              progress, and deliver therapy where children thrive the most.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="rounded-2xl bg-[#7D4DFF] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-300 transition-transform hover:-translate-y-0.5">
                Get started
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-md">
                <span className="flex h-6 w-10 items-center justify-center rounded-full border border-slate-200 text-xs font-semibold text-slate-700">
                  US
                </span>
                Proudly serving Northern Virginia
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-6 rounded-[28px] bg-purple-200 opacity-40 blur-3xl" />
            <div className="relative h-full min-h-[320px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-purple-200">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80")',
                }}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 rounded-2xl bg-[#1C1939] px-6 py-6 text-white shadow-xl shadow-purple-200 sm:grid-cols-3">
          {highlightItems.map((item) => (
            <div key={item.label} className="flex items-center gap-4 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                {item.icon}
              </div>
              <p className="font-semibold">{item.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-2 gap-4 max-[440px]:grid-cols-1 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-purple-100">
            <p className="text-sm text-slate-500">Therapists</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{therapistCount || '—'}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-purple-100">
            <p className="text-sm text-slate-500">Patients</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{patientCount || '—'}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-purple-100">
            <p className="text-sm text-slate-500">Scheduled</p>
            <p className="mt-2 text-3xl font-bold text-[#7D4DFF]">{scheduledCount}</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-lg shadow-purple-100">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-500">{completedCount}</p>
          </div>
        </section>

        <section className="mt-12 space-y-6 rounded-[32px] bg-white px-6 py-8 shadow-2xl shadow-purple-100">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-500">Sessions</p>
              <h2 className="text-2xl font-semibold text-slate-900">Manage active care plans</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search therapist or patient"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-[#7D4DFF] focus:outline-none focus:ring-2 focus:ring-[#C7B5FF]/60 md:w-56"
              />
              <div className="relative w-full md:w-48" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusMenuOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#7D4DFF] focus:outline-none focus:ring-2 focus:ring-[#C7B5FF]/60"
                >
                  <span>
                    {
                      {
                        All: 'All statuses',
                        Scheduled: 'Scheduled',
                        Completed: 'Completed',
                      }[statusFilter]
                    }
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 text-[#7D4DFF] transition-transform ${
                      isStatusMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </button>
                {isStatusMenuOpen && (
                  <div className="absolute left-0 right-0 z-10 mt-2 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-purple-100">
                    {[
                      { label: 'All statuses', value: 'All' },
                      { label: 'Scheduled', value: 'Scheduled' },
                      { label: 'Completed', value: 'Completed' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium transition first:rounded-t-2xl last:rounded-b-2xl ${
                          statusFilter === option.value
                            ? 'bg-[#F5F3FF] text-[#7D4DFF]'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          setStatusFilter(option.value as 'All' | 'Scheduled' | 'Completed');
                          setIsStatusMenuOpen(false);
                        }}
                      >
                        {option.label}
                        {statusFilter === option.value && (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                            <path
                              d="M5 13l4 4L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              fill="none"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="min-h-[420px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-500">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                <p className="text-lg font-semibold">No sessions yet</p>
                <p className="text-sm">
                  Once therapy begins, sessions will show up here with live updates.
                </p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                <p className="text-lg font-semibold">No matches for this filter</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('All');
                  }}
                  className="text-sm font-semibold text-[#7D4DFF] underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="hidden h-full overflow-hidden rounded-3xl border border-slate-100 shadow-xl md:block">
                  <div className="h-full overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead className="bg-[#F5F3FF] text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#5E4786]">
                        <tr>
                          <th className="px-6 py-4">Therapist</th>
                          <th className="px-6 py-4">Patient</th>
                          <th className="px-6 py-4">Date &amp; Time</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                        {filteredSessions.map((session) => (
                          <tr key={session.id} className="transition hover:bg-slate-50/60">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{session.therapistName}</div>
                              <p className="text-xs text-slate-500">Lead therapist</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{session.patientName}</div>
                              <p className="text-xs text-slate-500">Care plan</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{formatDate(session.date)}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                  session.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-[#EAE7FF] text-[#5B3ADF]'
                                }`}
                              >
                                <span className="h-2 w-2 rounded-full bg-current" />
                                {session.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {session.status === 'Scheduled' ? (
                                <button
                                  onClick={() => markCompleted(session.id)}
                                  disabled={updatingId === session.id}
                                  className="rounded-full border border-[#7D4DFF] px-4 py-2 text-xs font-semibold text-[#7D4DFF] transition hover:bg-[#F2ECFF] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                                >
                                  {updatingId === session.id ? 'Updating…' : 'Mark completed'}
                                </button>
                              ) : (
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                                  Completed
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 md:hidden">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-purple-500">Therapist</p>
                          <p className="text-base font-semibold text-slate-900">{session.therapistName}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            session.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-[#EAE7FF] text-[#5B3ADF]'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Patient
                          </p>
                          <p className="text-base text-slate-900">{session.patientName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Date &amp; time
                          </p>
                          <p>{formatDate(session.date)}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {session.status === 'Scheduled' ? (
                          <button
                            onClick={() => markCompleted(session.id)}
                            disabled={updatingId === session.id}
                            className="rounded-full border border-[#7D4DFF] px-4 py-2 text-xs font-semibold text-[#7D4DFF] transition hover:bg-[#F2ECFF] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                          >
                            {updatingId === session.id ? 'Updating…' : 'Mark completed'}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
