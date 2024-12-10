import './index.css'

const NotFound = props => {
  const {history} = props
  const onClickHomePage = () => {
    history.replace('/')
  }
  return (
    <div className="pageNotfound_container">
      <img
        src="https://res.cloudinary.com/dd3phabkh/image/upload/v1733149525/erroring_1_raifnm.png"
        alt="page not found"
        className="pagenotfound_img"
      />
      <h1 className="Notfound_header">Page Not Found</h1>
      <p className="Notfound_Subheader">
        We are sorry, the page you requested could not be found
      </p>
      <button className="home_btn" type="button" onClick={onClickHomePage}>
        Home Page
      </button>
    </div>
  )
}
export default NotFound
