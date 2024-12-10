import {Link, withRouter} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'

import {FaSearch} from 'react-icons/fa'

import './index.css'

class Header extends Component {
  state = {searchTxt: ''}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onChangeSearchTxt = event => {
    this.setState({searchTxt: event.target.value})
  }

  render() {
    const {searchTxt} = this.state
    return (
      <nav className="nav-header">
        <div className="nav-content">
          <div className="nav-bar-large-container">
            <Link to="/" className="logo_container_header">
              <img
                className="website-logo"
                src="https://res.cloudinary.com/dd3phabkh/image/upload/v1733123030/logo_zkq5xm.png"
                alt="website logo"
              />
              <h1 className="logo_header">Insta Share</h1>
            </Link>
            <ul className="nav-menu">
              <li className="search_container">
                <input
                  type="search"
                  className="inputSearch_Field"
                  value={searchTxt}
                  onChange={this.onChangeSearchTxt}
                  placeholder="Search Caption"
                />
                <Link
                  to={`/searchResult/${searchTxt}`}
                  className="search_button"
                  testid="searchIcon"
                >
                  <FaSearch color="#989898" className="search_icon" />
                </Link>
              </li>
              <li className="nav-menu-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>

              <li className="nav-menu-item">
                <Link to="/my-profile" className="nav-link">
                  Profile
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="logout-desktop-btn"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
