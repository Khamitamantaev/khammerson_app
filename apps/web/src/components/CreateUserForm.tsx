import { useState } from 'react';
import { trpc } from '../trpc/client';

export const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    name: '',
  });
  const [result, setResult] = useState<any>(null);

  const createUser = trpc.users.create.useMutation({
    onSuccess: (data) => {
      setResult({ success: true, data });
      setFormData({ email: '', userName: '', password: '', name: '' });
    },
    onError: (error) => {
      setResult({ success: false, error: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <h2>Создать пользователя</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="userName"
            placeholder="Имя пользователя"
            value={formData.userName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Полное имя"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={createUser.status === 'pending'}
          style={{
            width: '100%',
            padding: '10px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: createUser.status === 'pending' ? 'not-allowed' : 'pointer'
          }}
        >
          {createUser.status === 'pending' ? 'Создание...' : 'Создать'}
        </button>
      </form>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: result.success ? '#e6ffe6' : '#ffe6e6',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '300px'
        }}>
          {result.success ? (
            <div>
              <strong>✅ Пользователь создан:</strong>
              <pre style={{ 
                margin: '10px 0 0 0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '14px'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div>
              <strong>❌ Ошибка:</strong>
              <pre style={{ 
                margin: '10px 0 0 0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '14px',
                color: '#d32f2f'
              }}>
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};