import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import ShowPostDetails from '../ShowPostDetails'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class SearchResults extends Component {
  state = {
    postList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMyProfileAPi()
  }

  renderLoader = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#000000" height="50" width="50" />
    </div>
  )

  renderApiFailed = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt="failure view"
        />

        <p>Something went wrong. Please try again</p>
        <button type="button" onClick={this.OnRetryApi}>
          Try again
        </button>
      </div>
    </>
  )

  OnRetryApi = () => {
    this.getMyProfileAPi()
  }

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
    const {match} = this.props
    const {params} = match
    const {searchTxt} = params
    const jwtToken = Cookies.get('jwt_token')
    console.log('searchTxt inside searchresults = ', searchTxt, this.props)
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchTxt}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(url, options)

      if (response.ok) {
        const data = await response.json()
        console.log('my search results data=', data)
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
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.log('Search resulsts error :', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getmyProfileDetails = () => {
    const {postList} = this.state
    console.log('search resutl length = ', postList.length)
    return (
      <>
        {postList.length > 0 ? (
          <ul className="postsUl_container">
            {postList.map(eachPost => (
              <ShowPostDetails eachDetail={eachPost} key={eachPost.postId} />
            ))}
          </ul>
        ) : (
          <div className="noSearch_container">
            <img
              src="https://res.cloudinary.com/dd3phabkh/image/upload/v1733213398/Group_mi16qa.png"
              className="nosearch_img"
              alt="search not found"
            />
            <h1 className="nosearch_header">Search Not Found</h1>
            <p className="nosearch_desc">
              Try different keyword or search again
            </p>
          </div>
        )}
      </>
    )
  }

  render() {
    return (
      <>
        <Header />

        <div className="SearchResult_container">
          <h1 className="searchResult_header">Search Results</h1>
          <div className="searchResults_cardcontainer">
            {this.rendermyProfile()}
          </div>
        </div>
      </>
    )
  }
}

export default SearchResults
