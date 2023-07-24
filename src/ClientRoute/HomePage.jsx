// HomePage.jsx
import React, { useState } from 'react'; // import useState
import { useNavigate, useLocation } from 'react-router-dom'; 
import './HomePage.css';
import { BASE_URL } from './AnnotationUtils/domain';

function LoginPage({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // reset error state
    setError('');

    fetch(`${BASE_URL}/catalog/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then(data => {
        // save the token in the local storage
        localStorage.setItem('token', data.token);

        // trigger the onSubmit prop
        onSubmit(username);
      })
      .catch(err => {
        // handle server error
        console.log(err)
        err.json().then(errorMessage => {
          setError(errorMessage.message);
        });
      });
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input className="input" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input className="input" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && (<p className="error-list">{error}</p>)}
      <button type="submit" className="login-button">Log In</button>
    </form>
  );
}


function SignupPage({ onSuccessfulSignup }) {
  const [realName, setRealName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});

  const isValidEmail = (email) => {
    // simple check, you can use more sophisticated regex for real projects
    return email.includes("@");
  }

  const isValidUsername = (username) => {
    // checks if username is alphanumeric and is 6-12 characters long
    return /^[a-z0-9]{6,12}$/i.test(username);
  }

  const isValidPassword = (password) => {
    // checks if password is 8 characters long
    return password.length >= 8;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // reset error state
    setError({});

    let formIsValid = true;

    if (!isValidUsername(username)) {
      setError((prevState) => ({ ...prevState, username: 'Username must be alphanumeric and 6-12 characters long.' }));
      formIsValid = false;
    }

    if (!isValidPassword(password)) {
      setError((prevState) => ({ ...prevState, password: 'Password must be at least 8 characters.' }));
      formIsValid = false;
    }

    if (!isValidEmail(email)) {
      setError((prevState) => ({ ...prevState, email: 'Please enter a valid email.' }));
      formIsValid = false;
    }

    if (formIsValid) {
      fetch(`${BASE_URL}/catalog/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ realName, username, password, email }),
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          } else {
            throw res;
          }
        })
        .then(data => {
          // save the token in the local storage
          localStorage.setItem('token', data.token);
    
          // trigger the onSubmit prop
          onSuccessfulSignup();
        })
        .catch(err => {
          // handle server error
          err.json().then(errorMessage => {
            setError((prevState) => ({ ...prevState, server: errorMessage.message }));
          });
        });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-group">
        <label htmlFor="realName">Real Name:</label>
        <input className="input" type="text" id="realName" name="realName" value={realName} onChange={(e) => setRealName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input className="input" type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input className="input" type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input className="input" type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {(error.username || error.password || error.email || error.server) && (
        <ul className="error-list">
          {error.username && <li className="error">{error.username}</li>}
          {error.password && <li className="error">{error.password}</li>}
          {error.email && <li className="error">{error.email}</li>}
          {error.server && <li className="error">{error.server}</li>}
        </ul>
      )}
      
      <button type="submit" className="login-button">Sign Up</button>
    </form>
  );
}


function HomePage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false); // State to toggle between forms

  const handleLogin = (username) => {
    navigate("/models", { state: { username: username } });
  };

  const handleSuccessfulSignup = () => {
    setIsSignup(false);
  };

  return (
    <div className="home">
      <div className="main-container">
        <div className="title-container">
          <h1 className="title">Attribute Annotation</h1>
        </div>

          <div className="login-container">
            <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
            {isSignup ? 
              <SignupPage onSuccessfulSignup={handleSuccessfulSignup} /> : 
              <LoginPage onSubmit={handleLogin} />}
            <p> 
              {isSignup ? 'Already have an account?' : 'Don\'t have an account?'}
              <button onClick={() => setIsSignup(!isSignup)} className="toggle-button">
                  {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
      </div>
    </div>
  );
}

export default HomePage;
