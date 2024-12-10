import {Component} from 'react'

import {Link} from 'react-router-dom'

import './index.css'

import {BsHeart} from 'react-icons/bs'

import {FaRegComment} from 'react-icons/fa'

import {BiShareAlt} from 'react-icons/bi'

import {FcLike} from 'react-icons/fc'

import Cookies from 'js-cookie'

class ShowPostDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {isLiked: false, likesCountShow: props.eachDetail.likesCount}
  }

  onClickLikeBtn = async (postId, likesCount) => {
    const {isLiked} = this.state
    // console.log('likesCount', likesCount, likesCountShow)

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`

    if (!isLiked) {
      const likeDetails = {
        like_status: true,
        likes_count: likesCount + 1,
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(likeDetails),
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const respose = await fetch(url, options)
      const data = await respose.json()
      console.log('post data = ', data)
      this.setState(prevState => ({
        isLiked: true,
        likesCountShow: prevState.likesCountShow + 1,
      }))
    } else {
      const likeDetails = {
        like_status: false,
        likes_count: likesCount - 1,
      }
      const options = {
        method: 'POST',
        body: JSON.stringify(likeDetails),
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
      const respose = await fetch(url, options)
      const data = await respose.json()
      console.log('post data = ', data)
      this.setState(prevState => ({
        isLiked: false,
        likesCountShow: prevState.likesCountShow - 1,
      }))
    }
  }

  render() {
    const {eachDetail} = this.props
    const {
      profilePic,
      userName,
      postDetails,
      likesCount,
      comments,
      createdAt,
      postId,
      userId,
    } = eachDetail

    const {isLiked, likesCountShow} = this.state

    return (
      <li className="post_container">
        <Link to={`/users/${userId}`} className="post_header_container">
          <div className="profile_img_container">
            <img
              src={profilePic}
              alt="post author profile"
              className="profile_Img"
            />
          </div>
          <p className="post_header">{userName}</p>
        </Link>

        <img src={postDetails.imageUrl} alt="post" className="post_Image" />
        <div className="post_content_container">
          <div className="like_share_container">
            {!isLiked ? (
              <button
                type="button"
                testid="likeIcon"
                className="likeshare_icon"
                onClick={() => this.onClickLikeBtn(postId, likesCount)}
              >
                <BsHeart size={24} />
              </button>
            ) : (
              <button
                type="button"
                testid="unLikeIcon"
                className="likeshare_icon"
                onClick={() => this.onClickLikeBtn(postId, likesCount)}
              >
                <FcLike size={24} />
              </button>
            )}

            <button type="button" className="likeshare_icon">
              <FaRegComment size={24} />
            </button>
            <button type="button" className="likeshare_icon">
              <BiShareAlt size={24} />
            </button>
          </div>
          <p className="like_count">{likesCountShow} likes</p>
          <p className="post_caption">{postDetails.caption}</p>
          {comments.map(eachComment => (
            <p className="post_comment" key={eachComment.userId}>
              <span className="post_comment_username">
                {eachComment.userName}
              </span>
              {eachComment.comment}
            </p>
          ))}
          <p className="post_createdAt">{createdAt}</p>
        </div>
      </li>
    )
  }
}
export default ShowPostDetails
