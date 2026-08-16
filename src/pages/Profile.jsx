import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2, LogOut } from 'lucide-react';

const TABS = ['My Information', 'Preferences', 'Privacy', 'Security'];

export default function Profile() {
  const { user, logout, checkIns } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('My Information');

  const joined = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  const avatarInitial = user?.pseudonym?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="s-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn btn-outline btn-sm">✏️ Edit Profile</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* ── Left: profile form ── */}
        <div>
          {/* Tab bar */}
          <div className="tab-bar">
            {TABS.map(t => (
              <button key={t} className={`tab-item${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {/* My Information */}
          {tab === 'My Information' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: 700, border: '3px solid #BFDBFE',
                  }}>{avatarInitial}</div>
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.pseudonym}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Change profile picture</div>
                </div>
              </div>

              {/* Form fields */}
              <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Full Name',   value: user?.pseudonym,      placeholder: 'Your full name'       },
                    { label: 'Role',        value: 'Student',             placeholder: 'Your role'            },
                    { label: 'Email',       value: user?.email,           placeholder: 'your@email.com'       },
                    { label: 'Course',      value: 'B.Tech CSE',          placeholder: 'Your course'          },
                    { label: 'Year',        value: '2nd Year',            placeholder: 'Year of study'        },
                  ].map(({ label, value, placeholder }) => (
                    <div key={label}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {label}
                      </label>
                      <input
                        className="input"
                        defaultValue={value}
                        placeholder={placeholder}
                        readOnly
                        style={{ cursor: 'default', background: 'var(--page-bg)' }}
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      About You
                    </label>
                    <textarea
                      className="textarea"
                      defaultValue="Just a student trying to be better every day."
                      style={{ minHeight: '80px', background: 'var(--page-bg)', cursor: 'default' }}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'Preferences' && (
            <div className="card">
              <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>App Preferences</h3>
              {['Daily check-in reminder', 'Weekly wellbeing summary', 'Forum activity notifications'].map(pref => (
                <div key={pref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-body)' }}>{pref}</span>
                  <div style={{ width: '42px', height: '22px', borderRadius: '99px', background: 'var(--primary)', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', right: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Privacy' && (
            <div className="card">
              <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Privacy & Data</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Your data is encrypted and stored securely. We comply with India's DPDP Act. You have full control over your data.
              </p>
              {['Download my data', 'Request data deletion', 'View privacy policy'].map(action => (
                <button key={action} className="btn btn-ghost btn-sm" style={{ display: 'block', marginBottom: '8px', width: '100%', textAlign: 'left' }}>
                  {action}
                </button>
              ))}
            </div>
          )}

          {tab === 'Security' && (
            <div className="card">
              <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Security</h3>
              <button className="btn btn-outline btn-sm" style={{ marginBottom: '12px' }}>Change Password</button>
              <br />
              <button className="btn btn-outline btn-sm">Enable Two-Factor Authentication</button>
            </div>
          )}

          {/* Danger zone */}
          <div className="card" style={{ marginTop: '20px', border: '1px solid #FECACA', background: 'var(--danger-light)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--danger)', marginBottom: '6px' }}>Danger Zone</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>These actions are permanent and cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-danger btn-sm">
                <Trash2 size={12} /> Delete Account
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginLeft: 'auto' }}
                onClick={() => { logout(); navigate('/'); }}
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: account summary ── */}
        <div>
          <div className="card" style={{ marginBottom: '14px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, margin: '0 auto 10px' }}>
                {avatarInitial}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.pseudonym}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
              <span className="badge badge-blue" style={{ marginTop: '8px' }}>Student</span>
            </div>

            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Account Summary
            </div>
            {[
              { label: 'Member since', value: joined },
              { label: 'Course', value: '2nd Year' },
              { label: 'Check-ins completed', value: checkIns?.length ?? 0 },
              { label: 'Journal entries', value: 8 },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
