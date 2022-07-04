import React from 'react'
import {useRouter} from "next/router"
import {useQuery} from "@apollo/client"
import Post from "../../components/Post"
import {GET_POST_BY_POST_ID} from "../../graphql/queries"

const PostPage = () => {
    const router = useRouter()
    console.log(router)
    const {data, error} = useQuery(GET_POST_BY_POST_ID, {
        variables: {
            id: router.query.postid
        }
    }) 
    console.log(data)

    const post: Post = data?.getPost
    return  (
        <div>
            <Post post={post}/>
        </div>
    )
}

export default PostPage