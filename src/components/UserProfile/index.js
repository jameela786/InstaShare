import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {FaCamera} from 'react-icons/fa'

import {BsGrid3X3} from 'react-icons/bs'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    userProfileList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfileAPi()
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderApiFailed = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>
          We are having some trouble to complete your request. Please try again.
        </p>
        <button type="button">Retry</button>
      </div>
    </>
  )

  renderUserProfile = () => {
    const {apiStatus} = this.state
    console.log('api status = ', apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getUserProfileDetails()
      case apiStatusConstants.failure:
        return this.renderApiFailed()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  getUserProfileAPi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    console.log('user id = ', id)
    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const UpdatedUserData = {
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        id: data.user_details.id,
        postsCount: data.user_details.posts_count,
        profilePic: data.user_details.profile_pic,
        userBio: data.user_details.user_bio,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
        posts: data.user_details.posts.map(each => ({
          id: each.id,
          image: each.image,
        })),
        stories: data.user_details.stories.map(each => ({
          id: each.id,
          image: each.image,
        })),
      }
      this.setState({
        userProfileList: UpdatedUserData,
        apiStatus: apiStatusConstants.success,
      })
      console.log('data=', data)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getUserProfileDetails = () => {
    const {userProfileList} = this.state
    const {
      profilePic,
      userName,
      postsCount,
      followersCount,
      followingCount,
      userBio,
      stories,
      posts,
    } = userProfileList
    return (
      <div className="UserProfile_container">
        <div className="userprofileShow_container">
          <img
            src={profilePic}
            className="userprofile_img"
            alt="user profile"
          />
          <div className="profileText_container">
            <h1 className="profile_name">{userName}</h1>
            <div className="user_details_count">
              <p className="user_post">
                {postsCount}
                <span className="spanpost"> posts</span>
              </p>
              <p className="user_followers">
                {followersCount}
                <span className="spanpost"> followers </span>
              </p>
              <p className="user_following">
                {followingCount}
                <span className="spanpost"> following</span>
              </p>
            </div>
            <p className="profile_namesub">{userName}</p>
            <p className="userBio">{userBio}</p>
          </div>
        </div>
        <ul className="stories_container">
          {stories.map(each => (
            <li className="story_img_container" key={each.id}>
              <img src={each.image} className="story_img" alt="user story" />
            </li>
          ))}
        </ul>
        <hr className="horizontal_LineBreak" />
        <div className="postTitleContainer">
          <div className="posticon_container">
            <BsGrid3X3 />
          </div>
          <p className="postshow_header">Posts</p>
        </div>
        <div className="postshow_containerMain">
          {posts.length > 0 ? (
            <ul className="eachPost_ulContainer">
              {posts.map(each => (
                <li className="eachpost_container" key={each.id}>
                  <img
                    src={each.image}
                    alt="user post"
                    className="eachpost_img"
                  />
                </li>
              ))}{' '}
            </ul>
          ) : (
            <div className="noPost_container">
              <div className="nopostimg_container">
                <FaCamera size={30} />
              </div>
              <p className="nopost_header">No Posts Yet</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        {this.renderUserProfile()}
      </>
    )
  }
}

export default UserProfile
