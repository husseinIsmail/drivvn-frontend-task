import './Header.css';

const Header = () => {
  return (
    <header className='header'>
      <h1 className='header-title'>SNAP!</h1>
      <div className='header-circle blue'></div>
      <div className='header-circle'></div>
      <div className='header-circle'></div>
    </header>
  );
};

export default Header;