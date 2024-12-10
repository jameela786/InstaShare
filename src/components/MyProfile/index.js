import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsGrid3X3} from 'react-icons/bs'

import {FaCamera} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {
    myProfileList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMyProfileAPi()
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

  rendermyProfile = () => {
    const {apiStatus} = this.state
    console.log('api status = ', apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getmyProfileDetails()
      case apiStatusConstants.failure:
        return this.renderApiFailed()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  getMyProfileAPi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/my-profile`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      console.log('my profile data=', data)
      const UpdatedmyData = {
        followersCount: data.profile.followers_count,
        followingCount: data.profile.following_count,
        id: data.profile.id,
        postsCount: data.profile.posts_count,
        profilePic: data.profile.profile_pic,
        userBio: data.profile.user_bio,
        myId: data.profile.my_id,
        userName: data.profile.user_name,
        posts: data.profile.posts.map(each => ({
          id: each.id,
          image: each.image,
        })),
        stories: data.profile.stories.map(each => ({
          id: each.id,
          image: each.image,
        })),
      }
      this.setState({
        myProfileList: UpdatedmyData,
        apiStatus: apiStatusConstants.success,
      })
      console.log('data=', data)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getmyProfileDetails = () => {
    const {myProfileList} = this.state
    const {
      profilePic,
      userName,
      postsCount,
      followersCount,
      followingCount,
      userBio,
      stories,
      posts,
    } = myProfileList
    return (
      <div className="myProfile_container">
        <div className="myprofileShow_container">
          <img src={profilePic} className="myprofile_img" alt="my profile" />
          <div className="profileText_container">
            <h1 className="profile_name">{userName}</h1>
            <div className="user_details_count">
              <p className="my_post">
                {postsCount}
                <span className="spanpost"> posts</span>
              </p>
              <p className="my_followers">
                {followersCount}
                <span className="spanpost"> followers </span>
              </p>
              <p className="my_following">
                {followingCount}
                <span className="spanpost"> following</span>
              </p>
            </div>
            <p className="profile_namesub">{userName}</p>
            <p className="myBio">{userBio}</p>
          </div>
        </div>
        <ul className="stories_container">
          {stories.map(each => (
            <li className="story_img_container" key={each.id}>
              <img src={each.image} className="story_img" alt="my story" />
            </li>
          ))}
        </ul>
        <hr className="horizontal_LineBreak" />
        <div className="postTitleContainer">
          <div className="posticon_container">
            <BsGrid3X3 size={24} />
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
                    alt="my post"
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
        {this.rendermyProfile()}
      </>
    )
  }
}

export default MyProfile
