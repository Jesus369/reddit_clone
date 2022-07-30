import React from "react";
import Post from "./Post";
import { useQuery } from "@apollo/client";
import { GET_ALL_POSTS, GET_ALL_POST_BY_TOPIC } from "../graphql/queries";

type Props = {
  topic?: string;
  post: typeof Post;
  key: number;
  id: number;
};

const Feed = ({ topic }: Props) => {
  const { data, error } = !topic
    ? useQuery(GET_ALL_POSTS)
    : useQuery(GET_ALL_POST_BY_TOPIC, {
        variables: {
          topic: topic
        }
      });

  const posts: typeof Post[] = !topic
    ? data?.getPostList
    : data?.getPostListByTopic;

  return (
    <div className="mt-5 space-y-4">
      {posts && posts?.map((post: any) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Feed;
