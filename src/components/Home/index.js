import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {Component} from 'react'

import {IoIosWarning} from 'react-icons/io'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'

import ShowPostDetails from '../ShowPostDetails'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusPostsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    profileList: [],
    apiStatus: apiStatusConstants.initial,
    apiPostStatus: apiStatusPostsConstants.initial,
    postList: [],
  }

  componentDidMount() {
    this.getUserProfileApi()
    this.getPostApi()
  }

  getUserProfileApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/insta-share/stories'
    // const url = 'https://apis.ccbshare/stories'
    const jWtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jWtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      console.log('data=', data)
      const UpdatedData = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))
      this.setState({
        profileList: UpdatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getPostApi = async () => {
    this.setState({apiPostStatus: apiStatusPostsConstants.inProgress})
    const url = 'https://apis.ccbp.in/insta-share/posts'
    // const url = 'https://apis.ccb-share/posts'

    const jWtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jWtToken}`,
      },
    }
    console.log('response post before= ')

    try {
      const response = await fetch(url, options)
      console.log('response post = ', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('getPostApi data=', data)
        const UpdatedData = data.posts.map(each => ({
          createdAt: each.created_at,
          likesCount: each.likes_count,
          storyUrl: each.story_url,
          postId: each.post_id,
          profilePic: each.profile_pic,
          userId: each.user_id,
          userName: each.user_name,
          comments: each.comments.map(eachcomments => ({
            comment: eachcomments.comment,
            userId: eachcomments.user_id,
            userName: eachcomments.user_name,
          })),

          postDetails: {
            caption: each.post_details.caption,
            imageUrl: each.post_details.image_url,
          },
        }))
        this.setState({
          postList: UpdatedData,
          apiPostStatus: apiStatusPostsConstants.success,
        })
      } else {
        this.setState({apiPostStatus: apiStatusPostsConstants.failure})
      }
    } catch (error) {
      console.log('api fail in get post api', error)
      this.setState({apiPostStatus: apiStatusPostsConstants.failure})
    }
  }

  renderLoader = () => {
    console.log('loader in post pai')
    return (
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    )
  }

  renderHomeVideos = () => {
    const {apiStatus} = this.state
    console.log('api status = ', apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getHomeContentDetails()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderHomePostVideos = () => {
    const {apiPostStatus} = this.state
    console.log(
      'renderHomePostVideos api status = ',
      apiPostStatus,
      apiStatusPostsConstants.failure,
    )
    switch (apiPostStatus) {
      case apiStatusPostsConstants.success:
        return this.getHomePostContentDetails()
      case apiStatusPostsConstants.failure:
        return this.renderApiFailed()
      case apiStatusPostsConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  getHomePostContentDetails = () => {
    const {postList} = this.state
    return (
      <ul className="postsUl_container">
        {postList.map(eachPost => (
          <ShowPostDetails eachDetail={eachPost} key={eachPost.postId} />
        ))}
      </ul>
    )
  }

  getHomeContentDetails = () => {
    const {profileList} = this.state
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 8,
      slidesToScroll: 1,
    }
    return profileList.length > 0 ? (
      <div className="slider_container">
        <Slider {...settings} className="slider_show">
          {profileList.map(each => (
            <Link
              to={`/users/${each.userId}`}
              className="profile_container"
              key={each.userId}
            >
              <img
                src={each.storyUrl}
                alt="user story"
                className="profile_img"
              />
              <p className="profile_header">{each.userName}</p>
            </Link>
          ))}
        </Slider>
      </div>
    ) : null
  }

  renderApiFailed = () => (
    <>
      <div className="failureApi_container">
        <div className="failure_icon">
          <IoIosWarning size={24} color="#4094EF" />
        </div>
        <p className="failure_head">Something went wrong. Please try again</p>

        <button type="button" onClick={this.OnRetryApi} className="retry_btn">
          Try again
        </button>
      </div>
    </>
  )

  OnRetryApi = () => {
    this.renderHomePostVideos()
  }

  render() {
    return (
      <>
        <Header />

        <div className="home-container">
          {this.renderHomeVideos()}
          {this.renderHomePostVideos()}
        </div>
      </>
    )
  }
}

export default Home
